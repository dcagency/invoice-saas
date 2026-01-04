import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ClientsPageClient from '@/components/ClientsPageClient'
import EmptyStateClient from '@/components/EmptyStateClient'
import { PageContainer } from '@/components/layout/PageContainer'

export default async function ClientsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const clients = await prisma.client.findMany({
    where: {
      userId,
    },
    orderBy: {
      companyName: 'asc',
    },
  })

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clients</h1>
            <p className="mt-2 text-muted-foreground">Manage your client contacts</p>
          </div>
          <a
            href="/clients/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
          >
            Add New Client
          </a>
        </div>

        {clients.length === 0 ? (
          <div className="bg-card border border-border shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <EmptyStateClient />
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <ClientsPageClient clients={clients} />
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}

