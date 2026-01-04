'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ClientForm from './ClientForm'
import { toast } from '@/lib/toast'

interface ClientFormWrapperProps {
  initialData?: {
    id: string
    companyName: string
    contactName: string | null
    email: string | null
    phone: string | null
    streetAddress: string | null
    city: string | null
    state: string | null
    postalCode: string | null
    country: string | null
    taxId: string | null
    notes: string | null
  } | null
  isEdit?: boolean
}

export default function ClientFormWrapper({
  initialData = null,
  isEdit = false,
}: ClientFormWrapperProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    setError(null)

    try {
      const url = isEdit ? `/api/clients/${initialData?.id}` : '/api/clients'
      const method = isEdit ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save client')
      }

      // Show success message
      toast.success(
        isEdit ? 'Client updated successfully' : 'Client added successfully',
        `Client ${data.companyName || ''} has been saved`
      )
      router.push('/clients')
      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(
        isEdit ? 'Failed to update client' : 'Failed to create client',
        errorMessage
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/clients')
  }

  return (
    <>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      <ClientForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </>
  )
}


