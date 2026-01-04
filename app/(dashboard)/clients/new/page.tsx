import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import ClientFormWrapper from '@/components/ClientFormWrapper'
import { PageContainer } from '@/components/layout/PageContainer'

export default async function NewClientPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <PageContainer maxWidth="max-w-3xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New Client</h1>
          <p className="mt-2 text-muted-foreground">Create a new client contact</p>
        </div>
        <div className="bg-card border border-border shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <ClientFormWrapper />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}


