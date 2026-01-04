import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isProfileComplete } from '@/lib/company-profile'
import { handleApiError } from '@/lib/api/error-handler'

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

    return NextResponse.json({
      exists,
      isComplete: complete,
      profile: profile || null,
    })
  } catch (error) {
    return handleApiError(error, 'GET /api/company/profile/status')
  }
}


