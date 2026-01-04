import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { handleApiError } from '@/lib/api/error-handler'

const companyProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters').max(200, 'Company name must be at most 200 characters'),
  contactName: z.string().optional().nullable(),
  email: z.string().email('Invalid email format').optional().nullable().or(z.literal('')),
  phone: z.string().optional().nullable(),
  streetAddress: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  taxId: z.string().optional().nullable(),
})

// POST /api/company/profile - Create a new company profile
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = companyProfileSchema.parse(body)

    // Check if profile already exists
    const existing = await prisma.companyProfile.findUnique({
      where: { userId },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Company profile already exists' },
        { status: 409 }
      )
    }

    const companyProfile = await prisma.companyProfile.create({
      data: {
        userId,
        companyName: validatedData.companyName,
        contactPerson: validatedData.contactName || null, // Map contactName to contactPerson
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        streetAddress: validatedData.streetAddress || null,
        city: validatedData.city || null,
        stateProvince: validatedData.state || null, // Map state to stateProvince
        postalCode: validatedData.postalCode || null,
        country: validatedData.country || null,
        taxId: validatedData.taxId || null,
      },
    })

    // Map Prisma fields to API response format
    return NextResponse.json(
      {
        ...companyProfile,
        contactName: companyProfile.contactPerson ?? null, // Map contactPerson to contactName
        state: companyProfile.stateProvince ?? null, // Map stateProvince to state
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
    return handleApiError(error, 'POST /api/company/profile')
  }
}

// GET /api/company/profile - Get the company profile
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.companyProfile.findUnique({
      where: {
        userId,
      },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Company profile not found' }, { status: 404 })
    }

    // Map Prisma fields to API response format
    return NextResponse.json({
      ...profile,
      contactName: profile.contactPerson ?? null, // Map contactPerson to contactName
      state: profile.stateProvince ?? null, // Map stateProvince to state
    })
  } catch (error) {
    return handleApiError(error, 'GET /api/company/profile')
  }
}

// PATCH /api/company/profile - Update the company profile
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = companyProfileSchema.parse(body)

    // Check if profile exists
    const existing = await prisma.companyProfile.findUnique({
      where: { userId },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Company profile not found' },
        { status: 404 }
      )
    }

    const companyProfile = await prisma.companyProfile.update({
      where: {
        userId,
      },
      data: {
        companyName: validatedData.companyName,
        contactPerson: validatedData.contactName || null, // Map contactName to contactPerson
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        streetAddress: validatedData.streetAddress || null,
        city: validatedData.city || null,
        stateProvince: validatedData.state || null, // Map state to stateProvince
        postalCode: validatedData.postalCode || null,
        country: validatedData.country || null,
        taxId: validatedData.taxId || null,
      },
    })

    // Map Prisma fields to API response format
    return NextResponse.json({
      ...companyProfile,
      contactName: companyProfile.contactPerson ?? null, // Map contactPerson to contactName
      state: companyProfile.stateProvince ?? null, // Map stateProvince to state
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', code: 'VALIDATION_ERROR', details: error.errors },
        { status: 400 }
      )
    }
    return handleApiError(error, 'PATCH /api/company/profile')
  }
}
