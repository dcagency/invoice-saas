'use client'

import StatusBadge from './StatusBadge'
import DownloadPDFButton from './DownloadPDFButton'

interface Invoice {
  id: string
  invoiceNumber: string
  issueDate: string
  dueDate: string
  total: number | string
  status: 'DRAFT' | 'SENT' | 'PAID'
  client: {
    companyName: string
  }
}

interface InvoicesTableProps {
  invoices: Invoice[]
  onView: (invoiceId: string) => void
  onEdit: (invoiceId: string) => void
  onDelete: (invoiceId: string, invoiceNumber: string) => void
  onMarkAsPaid: (invoiceId: string) => void
  updatingId: string | null
}

export default function InvoicesTable({
  invoices,
  onView,
  onEdit,
  onDelete,
  onMarkAsPaid,
  updatingId,
}: InvoicesTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number | string | null | undefined) => {
    if (amount === null || amount === undefined) return '0.00'
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(num) || !isFinite(num)) return '0.00'
    return num.toFixed(2)
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-lg border border-border shadow-sm">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider sm:pl-6">
                Invoice Number
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Client
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Issue Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="relative px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-muted/30 transition-colors duration-150">
                <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-foreground sm:pl-6">
                  <button
                    onClick={() => onView(invoice.id)}
                    className="text-primary hover:text-primary-hover transition-colors"
                  >
                    {invoice.invoiceNumber}
                  </button>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                  {invoice.client.companyName}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                  {formatDate(invoice.issueDate)}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                  {formatDate(invoice.dueDate)}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-right font-semibold text-foreground">
                  ${formatCurrency(invoice.total)}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-center">
                  <StatusBadge status={invoice.status} size="sm" />
                </td>
                <td className="relative whitespace-nowrap px-4 py-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex items-center justify-end gap-2">
                    {invoice.status === 'SENT' && (
                      <button
                        onClick={() => onMarkAsPaid(invoice.id)}
                        disabled={updatingId === invoice.id}
                        className={`text-status-paid hover:text-status-paid/80 p-1 transition-colors ${
                          updatingId === invoice.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title="Mark as paid"
                        aria-label="Mark invoice as paid"
                      >
                        {updatingId === invoice.id ? (
                          <svg
                            className="w-5 h-5 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => onView(invoice.id)}
                      className="text-primary hover:text-primary-hover transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(invoice.id)}
                      className="text-primary hover:text-primary-hover transition-colors"
                    >
                      Edit
                    </button>
                    <DownloadPDFButton
                      invoiceId={invoice.id}
                      invoiceNumber={invoice.invoiceNumber}
                      variant="icon"
                      size="sm"
                    />
                    <button
                      onClick={() => onDelete(invoice.id, invoice.invoiceNumber)}
                      className="text-error hover:text-error/80 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <button
                  onClick={() => onView(invoice.id)}
                  className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                >
                  {invoice.invoiceNumber}
                </button>
                <p className="text-sm text-muted-foreground mt-1">{invoice.client.companyName}</p>
              </div>
              <StatusBadge status={invoice.status} size="sm" />
            </div>
            <dl className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <dt className="text-muted-foreground">Issue Date:</dt>
                <dd className="text-foreground font-medium">{formatDate(invoice.issueDate)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Due Date:</dt>
                <dd className="text-foreground font-medium">{formatDate(invoice.dueDate)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground">Total:</dt>
                <dd className="text-lg font-semibold text-foreground">${formatCurrency(invoice.total)}</dd>
              </div>
            </dl>
            <div className="flex gap-2 pt-3 border-t border-border">
              {invoice.status === 'SENT' && (
                <button
                  onClick={() => onMarkAsPaid(invoice.id)}
                  disabled={updatingId === invoice.id}
                  className={`flex-1 text-sm text-status-paid hover:text-status-paid/80 p-1 transition-colors ${
                    updatingId === invoice.id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title="Mark as paid"
                  aria-label="Mark invoice as paid"
                >
                  {updatingId === invoice.id ? (
                    <svg
                      className="w-5 h-5 animate-spin mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </button>
              )}
              <button
                onClick={() => onView(invoice.id)}
                className="flex-1 text-sm text-primary hover:text-primary-hover transition-colors"
              >
                View
              </button>
              <button
                onClick={() => onEdit(invoice.id)}
                className="flex-1 text-sm text-primary hover:text-primary-hover transition-colors"
              >
                Edit
              </button>
              <div className="flex-1">
                <DownloadPDFButton
                  invoiceId={invoice.id}
                  invoiceNumber={invoice.invoiceNumber}
                  variant="icon"
                  size="sm"
                />
              </div>
              <button
                onClick={() => onDelete(invoice.id, invoice.invoiceNumber)}
                className="flex-1 text-sm text-error hover:text-error/80 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

