'use client'

import { useEffect } from 'react'

interface EmailInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  invoice: {
    invoiceNumber: string
    issueDate: Date | string
    dueDate: Date | string
    total: number | string
    client: {
      companyName: string
      contactName: string | null
      email: string | null
    }
  }
  companyProfile: {
    companyName: string
  } | null
}

export default function EmailInvoiceModal({
  isOpen,
  onClose,
  invoice,
  companyProfile,
}: EmailInvoiceModalProps) {
  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString()
  }

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(num) || !isFinite(num)) return '0.00'
    return num.toFixed(2)
  }

  const clientEmail = invoice.client?.email || ''
  const hasClientEmail = clientEmail.trim() !== ''
  const companyName = companyProfile?.companyName || 'Your Company'
  const clientName = invoice.client?.contactName || invoice.client?.companyName || 'Client'

  const subject = `Invoice #${invoice.invoiceNumber} from ${companyName}`
  const message = `Dear ${clientName},

Please find attached invoice #${invoice.invoiceNumber} for $${formatCurrency(invoice.total)}.

Issue Date: ${formatDate(invoice.issueDate)}
Due Date: ${formatDate(invoice.dueDate)}

Thank you for your business.

${companyName}`

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Email Invoice</h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Recipient Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
                {hasClientEmail ? (
                  <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                    {clientEmail}
                  </div>
                ) : (
                  <div className="rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
                    ⚠️ This client has no email address on file
                  </div>
                )}
                {!hasClientEmail && (
                  <p className="mt-1 text-xs text-gray-500">
                    Add an email address in the client details to use this feature.
                  </p>
                )}
              </div>

              {/* Subject Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
                <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                  {subject}
                </div>
              </div>

              {/* Message Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
                <textarea
                  readOnly
                  disabled
                  value={message}
                  rows={8}
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 resize-none"
                />
              </div>

              {/* Attachment Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachment:</label>
                <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                  Invoice-{invoice.invoiceNumber.replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  (PDF will be generated when email is sent)
                </p>
              </div>

              {/* Info Banner */}
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Email integration is not yet available. This feature is coming soon.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              disabled
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white opacity-50 cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
            >
              Send Email
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

