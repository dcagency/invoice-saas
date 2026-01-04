import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'
import {
  calculateLineTotal,
  calculateSubtotal,
  calculateTaxAmount,
  calculateTotal,
} from '@/lib/invoice-calculations'
import { isValidCuid } from '@/lib/api/validators'
import { handleApiError } from '@/lib/api/error-handler'

// Server-side helper to convert number to Prisma Decimal
function toDecimal(value: number | string | null | undefined): Decimal {
  if (value === null || value === undefined) {
    return new Decimal(0)
  }
  return new Decimal(value)
}

// POST /api/invoices/[id]/duplicate - Duplicate an invoice
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Validate ID format
    if (!isValidCuid(params.id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid invoice ID format', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // CRITICAL: Fetch source invoice with ownership check
    const sourceInvoice = await prisma.invoice.findFirst({
      where: {
        id: params.id,
        userId, // CRITICAL: ownership check
      },
      include: {
        lineItems: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    })

    if (!sourceInvoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // CRITICAL: Verify client still exists and belongs to user (prevent duplication with deleted client)
    const client = await prisma.client.findFirst({
      where: {
        id: sourceInvoice.clientId,
        userId, // CRITICAL: ownership check
      },
    })

    if (!client) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot duplicate invoice: client no longer exists',
          code: 'CLIENT_DELETED',
        },
        { status: 400 }
      )
    }

    // Get next invoice number using existing API endpoint
    let nextInvoiceNumber = 'INV-001'
    try {
      const nextNumberResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/invoices/next-number`,
        {
          headers: {
            Cookie: request.headers.get('cookie') || '',
          },
        }
      )
      if (nextNumberResponse.ok) {
        const nextNumberData = await nextNumberResponse.json()
        nextInvoiceNumber = nextNumberData.nextNumber || 'INV-001'
      }
    } catch (error) {
      console.error('Error fetching next invoice number:', error)
      // Fallback to inline logic
      const lastInvoice = await prisma.invoice.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: { invoiceNumber: true },
      })

      if (lastInvoice) {
        const match = lastInvoice.invoiceNumber.match(/^(.*?)(\d+)$/)
        if (match) {
          const prefix = match[1]
          const numStr = match[2]
          const numLength = numStr.length
          const nextNum = parseInt(numStr, 10) + 1
          const nextNumStr = nextNum.toString().padStart(numLength, '0')
          nextInvoiceNumber = prefix + nextNumStr
        }
      }
    }

    // Calculate dates
    const issueDate = new Date()
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    // Recalculate amounts (using existing calculation logic)
    const processedLineItems = sourceInvoice.lineItems.map((item) => {
      const quantity = Number(item.quantity)
      const unitPrice = Number(item.unitPrice)
      const lineTotal = calculateLineTotal(quantity, unitPrice)
      return {
        description: item.description,
        quantity: toDecimal(quantity),
        unitPrice: toDecimal(unitPrice),
        lineTotal: toDecimal(lineTotal),
        sortOrder: item.sortOrder,
      }
    })

    const subtotal = calculateSubtotal(
      sourceInvoice.lineItems.map((item) => ({
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      }))
    )
    const taxRate = sourceInvoice.taxPercentage ? Number(sourceInvoice.taxPercentage) : null
    const taxAmount = calculateTaxAmount(subtotal, taxRate)
    const totalAmount = calculateTotal(subtotal, taxAmount)

    // Create new invoice with transaction
    const newInvoice = await prisma.$transaction(async (tx) => {
      return await tx.invoice.create({
        data: {
          userId,
          clientId: sourceInvoice.clientId,
          invoiceNumber: nextInvoiceNumber,
          issueDate: issueDate,
          dueDate: dueDate,
          status: 'DRAFT',
          subtotal: toDecimal(subtotal),
          taxPercentage: taxRate ? toDecimal(taxRate) : null,
          taxAmount: taxAmount > 0 ? toDecimal(taxAmount) : null,
          totalAmount: toDecimal(totalAmount),
          notes: sourceInvoice.notes,
          lineItems: {
            create: processedLineItems,
          },
        },
        include: {
          lineItems: true,
          client: {
            select: {
              id: true,
              companyName: true,
            },
          },
        },
      })
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        invoiceId: newInvoice.id,
        invoiceNumber: newInvoice.invoiceNumber,
      },
      { status: 201 }
    )
  } catch (error) {
    return handleApiError(error, 'POST /api/invoices/[id]/duplicate')
  }
}

