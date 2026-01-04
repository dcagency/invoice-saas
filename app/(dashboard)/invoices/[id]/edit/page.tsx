import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { isProfileComplete } from '@/lib/company-profile'
import InvoiceFormWrapper from '@/components/InvoiceFormWrapper'
import { decimalToNumber, decimalToNumberOrZero } from '@/lib/prisma-helpers'
import { PageContainer } from '@/components/layout/PageContainer'

interface EditInvoicePageProps {
  params: { id: string }
}

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
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

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: params.id,
      userId,
    },
    include: {
      lineItems: {
        orderBy: {
          sortOrder: 'asc',
        },
      },
    },
  })

  if (!invoice) {
    redirect('/invoices')
  }

  const clients = await prisma.client.findMany({
    where: { userId },
    orderBy: { companyName: 'asc' },
  })

  return (
    <PageContainer maxWidth="max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Invoice</h1>
          <p className="mt-2 text-muted-foreground">Update invoice details and line items</p>
        </div>

        {(invoice.status === 'SENT' || invoice.status === 'PAID') && (
          <div className="rounded-md bg-warning-bg p-4 border border-warning/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-warning" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-warning">
                  ⚠ This invoice has been marked as {invoice.status}. Editing it may cause confusion. Proceed with caution.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card border border-border shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <InvoiceFormWrapper
              initialData={{
                id: invoice.id,
                clientId: invoice.clientId,
                invoiceNumber: invoice.invoiceNumber,
                issueDate: invoice.issueDate.toISOString(),
                dueDate: invoice.dueDate.toISOString(),
                status: invoice.status,
                taxRate: decimalToNumber(invoice.taxPercentage),
                notes: invoice.notes,
                lineItems: invoice.lineItems.map((item) => ({
                  description: item.description,
                  quantity: decimalToNumberOrZero(item.quantity),
                  unitPrice: decimalToNumberOrZero(item.unitPrice),
                })),
              }}
              clients={clients}
              mode="edit"
            />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}


