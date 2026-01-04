import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { isProfileComplete } from '@/lib/company-profile'
import InvoiceFormWrapper from '@/components/InvoiceFormWrapper'
import { PageContainer } from '@/components/layout/PageContainer'

export default async function NewInvoicePage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Check company profile is complete
  const companyProfile = await prisma.companyProfile.findUnique({
    where: { userId },
  })

  if (!companyProfile || !isProfileComplete(companyProfile)) {
    redirect('/company/edit')
  }

  // Get clients
  const clients = await prisma.client.findMany({
    where: { userId },
    orderBy: { companyName: 'asc' },
  })


  return (
    <PageContainer maxWidth="max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Invoice</h1>
          <p className="mt-2 text-muted-foreground">Fill in the details below to create a new invoice</p>
        </div>
        <div className="bg-card border border-border shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <InvoiceFormWrapper
              clients={clients}
              mode="create"
            />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}


