import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CompanyProfileFormWrapper from '@/components/CompanyProfileFormWrapper'
import ProfileCompletionBadge from '@/components/ProfileCompletionBadge'
import { isProfileComplete } from '@/lib/company-profile'
import { PageContainer } from '@/components/layout/PageContainer'
import { toCompanyProfileDTO } from '@/lib/mappers/companyProfile'

export default async function CompanyEditPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Get or create user in database
  let user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    const userClerk = await currentUser()
    const email = userClerk?.emailAddresses[0]?.emailAddress

    if (!email) {
      redirect('/sign-in')
    }

    user = await prisma.user.create({
      data: {
        id: userId,
        email,
      },
    })
  }

  // Get company profile - if doesn't exist, redirect to setup
  const companyProfile = await prisma.companyProfile.findUnique({
    where: { userId },
  })

  if (!companyProfile) {
    redirect('/company/setup')
  }

  const complete = isProfileComplete(companyProfile)

  // Convert Prisma format to DTO using mapper
  const companyProfileDTO = toCompanyProfileDTO(companyProfile)

  return (
    <PageContainer maxWidth="max-w-3xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Company Profile</h1>
          <p className="mt-2 text-muted-foreground">Manage your company information that appears on invoices</p>
        </div>
        <div className="bg-card border border-border shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-4">
              <ProfileCompletionBadge isComplete={complete} />
            </div>
            <CompanyProfileFormWrapper
              initialData={companyProfileDTO}
              mode="edit"
            />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
