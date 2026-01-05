import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import InvoicesPageClient from '@/components/InvoicesPageClient'
import { decimalToNumberOrZero } from '@/lib/prisma-helpers'
import { PageContainer } from '@/components/layout/PageContainer'

export default async function InvoicesPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const invoices = await prisma.invoice.findMany({
    where: { userId },
    include: {
      client: {
        select: {
          id: true,
          companyName: true,
        },
      },
    },
    orderBy: {
      issueDate: 'desc',
    },
  })

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
            <p className="mt-2 text-muted-foreground">Manage and track all your invoices</p>
          </div>
          <a
            href="/invoices/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
          >
            Create New Invoice
          </a>
        </div>

        <InvoicesPageClient
          initialInvoices={invoices.map((invoice) => ({
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            issueDate: invoice.issueDate.toISOString(),
            dueDate: invoice.dueDate.toISOString(),
            total: decimalToNumberOrZero(invoice.totalAmount),
            status: invoice.status,
            client: invoice.client || {
              id: 'deleted',
              companyName: '[Client Deleted]',
            },
          }))}
        />
      </div>
    </PageContainer>
  )
}


