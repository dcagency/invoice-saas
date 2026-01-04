import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ClientFormWrapper from '@/components/ClientFormWrapper'
import { PageContainer } from '@/components/layout/PageContainer'

interface EditClientPageProps {
  params: { id: string }
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const client = await prisma.client.findFirst({
    where: {
      id: params.id,
      userId,
    },
  })

  if (!client) {
    redirect('/clients')
  }

  return (
    <PageContainer maxWidth="max-w-3xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Client</h1>
          <p className="mt-2 text-muted-foreground">Update client information</p>
        </div>
        <div className="bg-card border border-border shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <ClientFormWrapper initialData={client} isEdit={true} />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}


