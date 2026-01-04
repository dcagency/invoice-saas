import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { isProfileComplete } from '@/lib/company-profile'
import AnalyticsSection from '@/components/dashboard/AnalyticsSection'
import { PageContainer } from '@/components/layout/PageContainer'

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Get or create user in database
  let user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    // Get email from Clerk
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

  // Check if company profile exists
  const companyProfile = await prisma.companyProfile.findUnique({
    where: { userId },
  })

  if (!companyProfile) {
    redirect('/company/setup')
  }

  // Check if profile is complete
  const profileComplete = isProfileComplete(companyProfile)

  // Get invoice statistics
  const [totalInvoices, draftInvoices, sentInvoices, paidInvoices, recentInvoices] = await Promise.all([
    prisma.invoice.count({ where: { userId } }),
    prisma.invoice.count({ where: { userId, status: 'DRAFT' } }),
    prisma.invoice.count({ where: { userId, status: 'SENT' } }),
    prisma.invoice.count({ where: { userId, status: 'PAID' } }),
    prisma.invoice.findMany({
      where: { userId },
      take: 10,
      orderBy: { issueDate: 'desc' },
      include: {
        client: {
          select: {
            companyName: true,
          },
        },
      },
    }),
  ])

  return (
    <PageContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Welcome back! Here's an overview of your invoices.</p>
        </div>

        {/* Profile Completion CTA */}
        {!profileComplete && (
          <div className="mb-8 rounded-md bg-warning-bg p-4 border border-warning/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-warning mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm font-medium text-warning">
                  Your company profile is incomplete. Complete your address to generate invoices.
                </p>
              </div>
              <a
                href="/company/edit"
                className="ml-4 inline-flex items-center px-4 py-2 border border-warning/30 text-sm font-medium rounded-md text-warning bg-warning-bg hover:bg-warning/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warning"
              >
                Complete Profile
              </a>
            </div>
          </div>
        )}

        {/* Company Profile Summary */}
        {profileComplete && (
          <div className="mb-8 bg-card border border-border shadow rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="text-lg font-medium text-card-foreground">{companyProfile.companyName}</p>
              </div>
              <a
                href="/company/edit"
                className="text-sm text-primary hover:text-primary-hover"
              >
                Edit Profile
              </a>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-card border border-border overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">Total Invoices</dt>
                    <dd className="text-lg font-medium text-card-foreground">{totalInvoices}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">Draft</dt>
                    <dd className="text-lg font-medium text-card-foreground">{draftInvoices}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">Sent</dt>
                    <dd className="text-lg font-medium text-card-foreground">{sentInvoices}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">Paid</dt>
                    <dd className="text-lg font-medium text-card-foreground">{paidInvoices}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex gap-4">
          <a
            href="/invoices/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
          >
            Create New Invoice
          </a>
          <a
            href="/clients/new"
            className="inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
          >
            Add New Client
          </a>
        </div>

        {/* Recent Invoices */}
        <div className="bg-card border border-border shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-card-foreground mb-4">Recent Invoices</h3>
            {recentInvoices.length === 0 ? (
              <p className="text-muted-foreground">No invoices yet. Create your first invoice to get started.</p>
            ) : (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Invoice Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Issue Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {recentInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-card-foreground">
                          <a href={`/invoices/${invoice.id}`} className="text-primary hover:text-primary-hover">
                            {invoice.invoiceNumber}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{invoice.client.companyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {new Date(invoice.issueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(invoice.totalAmount))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            invoice.status === 'PAID' ? 'bg-status-paid-bg text-status-paid border border-status-paid/20' :
                            invoice.status === 'SENT' ? 'bg-status-sent-bg text-status-sent border border-status-sent/20' :
                            'bg-status-draft-bg text-status-draft border border-status-draft/20'
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mt-8">
          <AnalyticsSection />
        </div>

        {/* Navigation */}
        <nav className="flex gap-4">
          <a href="/invoices" className="text-primary hover:text-primary-hover">View All Invoices</a>
          <a href="/clients" className="text-primary hover:text-primary-hover">View All Clients</a>
          <a href="/company/edit" className="text-primary hover:text-primary-hover">Company Profile</a>
        </nav>
      </div>
    </PageContainer>
  )
}

