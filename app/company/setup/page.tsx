import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserButton } from '@clerk/nextjs'
import CompanyProfileFormWrapper from '@/components/CompanyProfileFormWrapper'

export default async function CompanySetupPage() {
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

  // Check if profile already exists - if yes, redirect to edit
  const companyProfile = await prisma.companyProfile.findUnique({
    where: { userId },
  })

  if (companyProfile) {
    redirect('/company/edit')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Invoice SaaS</h1>
          <UserButton />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card border border-border shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Complete Your Company Profile
            </h2>
            <p className="text-muted-foreground mb-6">
              This information will appear on your invoices. You can edit it later.
            </p>
            <CompanyProfileFormWrapper mode="create" />
          </div>
        </div>
      </main>
    </div>
  )
}
