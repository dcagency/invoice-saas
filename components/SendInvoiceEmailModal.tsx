'use client'

import { useState, useEffect } from 'react'
import { toast } from '@/lib/toast'

interface SendInvoiceEmailModalProps {
  isOpen: boolean
  onClose: () => void
  invoice: {
    id: string
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
  defaultEmail: string
}

export default function SendInvoiceEmailModal({
  isOpen,
  onClose,
  invoice,
  defaultEmail,
}: SendInvoiceEmailModalProps) {
  const [recipientEmail, setRecipientEmail] = useState<string>(defaultEmail)
  const [customMessage, setCustomMessage] = useState<string>('')
  const [isSending, setIsSending] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

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

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setRecipientEmail(defaultEmail)
      setCustomMessage(
        `Dear ${invoice.client.contactName || invoice.client.companyName || 'Client'},

Please find attached invoice #${invoice.invoiceNumber} for your review.

Best regards,
Your Company`
      )
      setError(null)
    } else {
      setRecipientEmail('')
      setCustomMessage('')
      setError(null)
    }
  }, [isOpen, defaultEmail, invoice])

  if (!isOpen) return null

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString()
  }

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(num) || !isFinite(num)) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!recipientEmail.trim()) {
      setError('Please enter a recipient email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail)) {
      setError('Please enter a valid email address')
      return
    }

    if (!customMessage.trim()) {
      setError('Please enter a message')
      return
    }

    if (customMessage.length > 2000) {
      setError('Message must be 2000 characters or less')
      return
    }

    setIsSending(true)
    try {
      const response = await fetch(`/api/invoices/${invoice.id}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: recipientEmail.trim(),
          customMessage: customMessage.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email')
      }

      toast.success('Email sent successfully', `Invoice sent to ${recipientEmail}`)
      onClose()
    } catch (error) {
      console.error('Error sending email:', error)
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to send email. Please check your connection.'
      setError(errorMessage)
      toast.error('Failed to send email', errorMessage)
    } finally {
      setIsSending(false)
    }
  }

  const sanitizedInvoiceNumber = invoice.invoiceNumber.replace(/[^a-zA-Z0-9-_]/g, '_')

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
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Send Invoice by Email
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <label htmlFor="recipient-email" className="block text-sm font-medium text-gray-700 mb-1">
                    To:
                  </label>
                  <input
                    id="recipient-email"
                    type="email"
                    required
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="client@example.com"
                  />
                </div>

                {/* Message Section */}
                <div>
                  <label htmlFor="custom-message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message:
                  </label>
                  <textarea
                    id="custom-message"
                    required
                    rows={6}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                    placeholder="Dear [Client Name],&#10;&#10;Please find attached invoice #[number]...&#10;&#10;Best regards,&#10;[Your Company]"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {customMessage.length} / 2000 characters
                  </p>
                </div>

                {/* Attachment Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attachment:</label>
                  <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                    Invoice-{sanitizedInvoiceNumber}.pdf (will be generated and attached)
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isSending}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? 'Sending...' : 'Send Email'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSending}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

