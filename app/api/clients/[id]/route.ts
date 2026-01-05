import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { isValidCuid } from '@/lib/api/validators'
import { handleApiError } from '@/lib/api/error-handler'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const clientSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactName: z.string().optional().nullable(),
  email: z.string().email('Invalid email format').optional().nullable().or(z.literal('')),
  phone: z.string().optional().nullable(),
  streetAddress: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  taxId: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

// GET /api/clients/[id] - Get a specific client
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
        { error: 'Invalid client ID format', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // CRITICAL: Ownership check - filter by userId
    const client = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId, // CRITICAL: ownership check
      },
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    return NextResponse.json(client)
  } catch (error) {
    return handleApiError(error, 'GET /api/clients/[id]')
  }
}

// PATCH /api/clients/[id] - Update a client
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
        { error: 'Invalid client ID format', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // CRITICAL: Verify client exists and belongs to user
    const existingClient = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId, // CRITICAL: ownership check
      },
    })

    if (!existingClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = clientSchema.parse(body)

    const client = await prisma.client.update({
      where: {
        id: params.id,
      },
      data: {
        companyName: validatedData.companyName,
        contactName: validatedData.contactName || null,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        streetAddress: validatedData.streetAddress || null,
        city: validatedData.city || null,
        state: validatedData.state || null,
        postalCode: validatedData.postalCode || null,
        country: validatedData.country || null,
        taxId: validatedData.taxId || null,
        notes: validatedData.notes || null,
      },
    })

    return NextResponse.json(client)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', code: 'VALIDATION_ERROR', details: error.errors },
        { status: 400 }
      )
    }
    return handleApiError(error, 'PATCH /api/clients/[id]')
  }
}

// DELETE /api/clients/[id] - Delete a client
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
        { error: 'Invalid client ID format', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // CRITICAL: Verify client exists and belongs to user
    const existingClient = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId, // CRITICAL: ownership check
      },
    })

    if (!existingClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // CRITICAL: Check if client has invoices (prevent deletion with invoices)
    const invoiceCount = await prisma.invoice.count({
      where: {
        clientId: params.id,
        userId, // Still check ownership
      },
    })

    if (invoiceCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete client: ${invoiceCount} invoice(s) exist for this client`,
          code: 'CLIENT_HAS_INVOICES',
          count: invoiceCount,
        },
        { status: 400 }
      )
    }

    await prisma.client.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true, message: 'Client deleted' })
  } catch (error) {
    return handleApiError(error, 'DELETE /api/clients/[id]')
  }
}


