import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { isValidCuid } from '@/lib/api/validators'
import { handleApiError } from '@/lib/api/error-handler'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const statusSchema = z.object({
  status: z.enum(['DRAFT', 'SENT', 'PAID']),
})

// PATCH /api/invoices/[id]/status - Update invoice status
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

    const body = await request.json()
    const validatedData = statusSchema.parse(body)

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

    // Update status
    const invoice = await prisma.invoice.update({
      where: { id: params.id },
      data: { status: validatedData.status },
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    })

    return NextResponse.json(invoice)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid status', code: 'VALIDATION_ERROR', details: error.errors },
        { status: 400 }
      )
    }
    return handleApiError(error, 'PATCH /api/invoices/[id]/status')
  }
}


