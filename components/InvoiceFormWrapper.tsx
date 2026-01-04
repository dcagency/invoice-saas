'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import InvoiceForm from './InvoiceForm'
import { toast } from '@/lib/toast'

interface Client {
  id: string
  companyName: string
}

interface InvoiceFormWrapperProps {
  initialData?: {
    id: string
    clientId: string
    invoiceNumber: string
    issueDate: string
    dueDate: string
    status: 'DRAFT' | 'SENT' | 'PAID'
    taxRate: number | null
    notes: string | null
    lineItems: Array<{
      description: string
      quantity: number | string
      unitPrice: number | string
    }>
  } | null
  clients: Client[]
  mode: 'create' | 'edit'
  nextInvoiceNumber?: string | null
}

export default function InvoiceFormWrapper({
  initialData = null,
  clients,
  mode,
  nextInvoiceNumber = null,
}: InvoiceFormWrapperProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestedNumber, setSuggestedNumber] = useState<string | null>(nextInvoiceNumber)
  const [basedOn, setBasedOn] = useState<string | null>(null)
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(mode === 'create' && !nextInvoiceNumber)

  useEffect(() => {
    if (mode === 'create' && !nextInvoiceNumber) {
      setIsLoadingSuggestion(true)
      fetch('/api/invoices/next-number')
        .then((res) => {
          if (!res.ok) throw new Error('API error')
          return res.json()
        })
        .then((data) => {
          setSuggestedNumber(data.nextNumber)
          setBasedOn(data.basedOn || null)
        })
        .catch((error) => {
          console.error('Failed to fetch suggested number:', error)
          // Fail silently, user can enter manually
        })
        .finally(() => {
          setIsLoadingSuggestion(false)
        })
    }
  }, [mode, nextInvoiceNumber])

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    setError(null)

    try {
      const url = mode === 'create' ? '/api/invoices' : `/api/invoices/${initialData?.id}`
      const method = mode === 'create' ? 'POST' : 'PATCH'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save invoice')
      }

      const invoice = await response.json()
      
      toast.success(
        mode === 'create' ? 'Invoice created successfully' : 'Invoice updated successfully',
        `Invoice ${invoice.invoiceNumber} is ready`
      )

      if (mode === 'create' && data.status === 'DRAFT') {
        router.push('/invoices')
      } else {
        router.push(`/invoices/${invoice.id}`)
      }
      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(
        mode === 'create' ? 'Failed to create invoice' : 'Failed to update invoice',
        errorMessage
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (initialData) {
      router.push(`/invoices/${initialData.id}`)
    } else {
      router.push('/invoices')
    }
  }

  return (
    <>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      <InvoiceForm
        initialData={initialData}
        clients={clients}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        mode={mode}
        nextInvoiceNumber={suggestedNumber}
        basedOn={basedOn}
        isLoadingSuggestion={isLoadingSuggestion}
      />
    </>
  )
}


