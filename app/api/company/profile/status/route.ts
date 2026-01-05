import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isProfileComplete } from '@/lib/company-profile'
import { handleApiError } from '@/lib/api/error-handler'
import { toCompanyProfileDTO } from '@/lib/mappers/companyProfile'

// GET /api/company/profile/status - Get the company profile status
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

    const exists = !!profile
    const complete = isProfileComplete(profile)

    // Convert Prisma format to DTO using mapper if profile exists
    const profileDTO = profile ? toCompanyProfileDTO(profile) : null

    return NextResponse.json({
      exists,
      isComplete: complete,
      profile: profileDTO,
    })
  } catch (error) {
    return handleApiError(error, 'GET /api/company/profile/status')
  }
}


