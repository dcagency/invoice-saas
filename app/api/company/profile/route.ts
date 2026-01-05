import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { handleApiError } from '@/lib/api/error-handler'
import { toCompanyProfileDTO, fromCompanyProfileDTO } from '@/lib/mappers/companyProfile'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Schema uses DTO format (contactName, state) for API/UI consistency
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

    // Convert DTO to Prisma format using mapper
    const prismaData = fromCompanyProfileDTO(validatedData)

    const companyProfile = await prisma.companyProfile.create({
      data: {
        userId,
        ...prismaData,
      },
    })

    // Convert Prisma format to DTO using mapper
    return NextResponse.json(toCompanyProfileDTO(companyProfile), { status: 201 })
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

    // Convert Prisma format to DTO using mapper
    return NextResponse.json(toCompanyProfileDTO(profile))
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

    // Convert DTO to Prisma format using mapper
    const prismaData = fromCompanyProfileDTO(validatedData)

    const companyProfile = await prisma.companyProfile.update({
      where: {
        userId,
      },
      data: prismaData,
    })

    // Convert Prisma format to DTO using mapper
    return NextResponse.json(toCompanyProfileDTO(companyProfile))
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
