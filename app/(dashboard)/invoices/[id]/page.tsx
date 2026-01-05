import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import InvoiceDetailView from '@/components/InvoiceDetailView'
import { decimalToNumber, decimalToNumberOrZero } from '@/lib/prisma-helpers'
import { PageContainer } from '@/components/layout/PageContainer'
import { toCompanyProfileDTO } from '@/lib/mappers/companyProfile'

interface InvoiceDetailPageProps {
  params: { id: string }
}

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: params.id,
      userId,
    },
    include: {
      client: true,
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

  const companyProfile = await prisma.companyProfile.findUnique({
    where: { userId },
  })

  // Convert Prisma format to DTO using mapper
  const companyProfileDTO = companyProfile ? toCompanyProfileDTO(companyProfile) : null

  return (
    <PageContainer maxWidth="max-w-5xl">
      <InvoiceDetailView
        invoice={{
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          issueDate: invoice.issueDate,
          dueDate: invoice.dueDate,
          status: invoice.status,
          subtotal: decimalToNumberOrZero(invoice.subtotal),
          taxRate: decimalToNumber(invoice.taxPercentage),
          taxAmount: decimalToNumber(invoice.taxAmount),
          total: decimalToNumberOrZero(invoice.totalAmount),
          notes: invoice.notes,
          client: invoice.client,
          lineItems: invoice.lineItems.map((item) => ({
            description: item.description,
            quantity: decimalToNumberOrZero(item.quantity),
            unitPrice: decimalToNumberOrZero(item.unitPrice),
            lineTotal: decimalToNumberOrZero(item.lineTotal),
          })),
        }}
        companyProfile={companyProfileDTO}
      />
    </PageContainer>
  )
}


