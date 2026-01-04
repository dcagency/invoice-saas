import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
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

const lineItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().positive('Quantity must be greater than 0'),
  unitPrice: z.number().min(0, 'Unit price must be >= 0'),
  sortOrder: z.number().int().optional(),
})

const invoiceSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  issueDate: z.string().datetime(),
  dueDate: z.string().datetime(),
  status: z.enum(['DRAFT', 'SENT', 'PAID']).default('DRAFT'),
  taxRate: z.number().min(0).max(100).nullable().optional(),
  notes: z.string().nullable().optional(),
  lineItems: z.array(lineItemSchema).min(1, 'At least one line item is required'),
})

// POST /api/invoices - Create a new invoice
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = invoiceSchema.parse(body)

    // Validate clientId format
    if (!isValidCuid(validatedData.clientId)) {
      return NextResponse.json(
        { error: 'Invalid client ID format', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // CRITICAL: Verify client belongs to user
    const client = await prisma.client.findFirst({
      where: {
        id: validatedData.clientId,
        userId, // CRITICAL: ownership check
      },
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found or access denied', code: 'CLIENT_NOT_FOUND' },
        { status: 400 } // 400, not 403 (prevents enumeration)
      )
    }

    // Check invoice number uniqueness
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        userId,
        invoiceNumber: validatedData.invoiceNumber,
      },
    })

    if (existingInvoice) {
      return NextResponse.json(
        { error: 'This invoice number is already in use', code: 'INVOICE_NUMBER_DUPLICATE' },
        { status: 409 }
      )
    }

    // Calculate amounts
    const processedLineItems = validatedData.lineItems.map((item, index) => {
      const lineTotal = calculateLineTotal(item.quantity, item.unitPrice)
      return {
        description: item.description,
        quantity: toDecimal(item.quantity),
        unitPrice: toDecimal(item.unitPrice),
        lineTotal: toDecimal(lineTotal),
        sortOrder: item.sortOrder ?? index,
      }
    })

    const subtotal = calculateSubtotal(validatedData.lineItems)
    const taxAmount = calculateTaxAmount(subtotal, validatedData.taxRate ?? null)
    const totalAmount = calculateTotal(subtotal, taxAmount)

    // Create invoice with transaction
    const invoice = await prisma.$transaction(async (tx) => {
      return await tx.invoice.create({
        data: {
          userId,
          clientId: validatedData.clientId,
          invoiceNumber: validatedData.invoiceNumber,
          issueDate: new Date(validatedData.issueDate),
          dueDate: new Date(validatedData.dueDate),
          status: validatedData.status,
          subtotal: toDecimal(subtotal),
          taxPercentage: validatedData.taxRate ? toDecimal(validatedData.taxRate) : null,
          taxAmount: taxAmount > 0 ? toDecimal(taxAmount) : null,
          totalAmount: toDecimal(totalAmount),
          notes: validatedData.notes || null,
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

    // Map Prisma fields to API response format
    return NextResponse.json(
      {
        ...invoice,
        taxRate: invoice.taxPercentage ?? null, // Map taxPercentage to taxRate
        total: invoice.totalAmount, // Map totalAmount to total
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', code: 'VALIDATION_ERROR', details: error.errors },
        { status: 400 }
      )
    }
    return handleApiError(error, 'POST /api/invoices')
  }
}

// GET /api/invoices - List all invoices
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as 'DRAFT' | 'SENT' | 'PAID' | null
    const clientId = searchParams.get('clientId')

    const where: any = {
      userId,
    }

    if (status && ['DRAFT', 'SENT', 'PAID'].includes(status)) {
      where.status = status
    }

    if (clientId) {
      where.clientId = clientId
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
          },
        },
        _count: {
          select: {
            lineItems: true,
          },
        },
      },
      orderBy: {
        issueDate: 'desc',
      },
    })

    // Map Prisma fields to API response format
    const mappedInvoices = invoices.map((invoice) => ({
      ...invoice,
      taxRate: invoice.taxPercentage ?? null, // Map taxPercentage to taxRate
      total: invoice.totalAmount, // Map totalAmount to total
    }))

    return NextResponse.json(mappedInvoices)
  } catch (error) {
    return handleApiError(error, 'GET /api/invoices')
  }
}

