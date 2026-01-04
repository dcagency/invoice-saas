'use client'

import { useState } from 'react'

interface DownloadPDFButtonProps {
  invoiceId: string
  invoiceNumber: string
  variant?: 'primary' | 'secondary' | 'icon'
  size?: 'sm' | 'md' | 'lg'
}

export default function DownloadPDFButton({
  invoiceId,
  invoiceNumber,
  variant = 'secondary',
  size = 'md',
}: DownloadPDFButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const variantClasses = {
    primary: 'border-transparent bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    icon: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 p-2',
  }

  const handleDownload = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`)

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized')
        }
        if (response.status === 404) {
          throw new Error('Invoice not found')
        }
        if (response.status === 400) {
          throw new Error('Company profile required')
        }
        throw new Error('Failed to generate PDF')
      }

      // Create blob and trigger download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Invoice-${invoiceNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      // Show success message
      alert('PDF downloaded successfully')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to download PDF'
      setError(errorMessage)
      alert(`Failed to download PDF: ${errorMessage}`)
      console.error('PDF download error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className={`inline-flex items-center border rounded-md shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]}`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
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
            {variant !== 'icon' && 'Generating...'}
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {variant !== 'icon' && 'Download PDF'}
          </>
        )}
      </button>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </>
  )
}


