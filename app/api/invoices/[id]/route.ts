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

// GET /api/invoices/[id] - Get a specific invoice
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate ID format
    if (!isValidCuid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid invoice ID format', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // CRITICAL: Ownership check - filter by userId
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: params.id,
        userId, // CRITICAL: ownership check
      },
      include: {
        client: true,
        lineItems: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Map Prisma fields to API response format
    return NextResponse.json({
      ...invoice,
      taxRate: invoice.taxPercentage ?? null, // Map taxPercentage to taxRate
      total: invoice.totalAmount, // Map totalAmount to total
    })
  } catch (error) {
    return handleApiError(error, 'GET /api/invoices/[id]')
  }
}

// PATCH /api/invoices/[id] - Update an invoice
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate ID format
    if (!isValidCuid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid invoice ID format', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // CRITICAL: Verify invoice exists and belongs to user
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        id: params.id,
        userId, // CRITICAL: ownership check
      },
    })

    if (!existingInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
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

    // CRITICAL: Verify client belongs to user (prevent cross-user access)
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

    // Check invoice number uniqueness (if changed)
    if (validatedData.invoiceNumber !== existingInvoice.invoiceNumber) {
      const duplicateInvoice = await prisma.invoice.findFirst({
        where: {
          userId,
          invoiceNumber: validatedData.invoiceNumber,
        },
      })

      if (duplicateInvoice) {
        return NextResponse.json(
          { error: 'This invoice number is already in use', code: 'INVOICE_NUMBER_DUPLICATE' },
          { status: 409 }
        )
      }
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

    // Update invoice with transaction
    const invoice = await prisma.$transaction(async (tx) => {
      // Delete existing line items
      await tx.invoiceLineItem.deleteMany({
        where: { invoiceId: params.id },
      })

      // Update invoice and create new line items
      return await tx.invoice.update({
        where: { id: params.id },
        data: {
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
    return NextResponse.json({
      ...invoice,
      taxRate: invoice.taxPercentage ?? null, // Map taxPercentage to taxRate
      total: invoice.totalAmount, // Map totalAmount to total
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', code: 'VALIDATION_ERROR', details: error.errors },
        { status: 400 }
      )
    }
    return handleApiError(error, 'PATCH /api/invoices/[id]')
  }
}

// DELETE /api/invoices/[id] - Delete an invoice
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate ID format
    if (!isValidCuid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid invoice ID format', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // CRITICAL: Verify invoice exists and belongs to user
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        id: params.id,
        userId, // CRITICAL: ownership check
      },
    })

    if (!existingInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Delete invoice (cascade will delete line items)
    await prisma.invoice.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, message: 'Invoice deleted' })
  } catch (error) {
    return handleApiError(error, 'DELETE /api/invoices/[id]')
  }
}

