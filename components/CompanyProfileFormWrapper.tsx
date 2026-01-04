'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CompanyProfileForm from './CompanyProfileForm'
import { toast } from '@/lib/toast'

interface CompanyProfileFormWrapperProps {
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
  } | null
  mode: 'create' | 'edit'
  onCancel?: () => void
}

export default function CompanyProfileFormWrapper({
  initialData = null,
  mode,
  onCancel,
}: CompanyProfileFormWrapperProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    setError(null)

    try {
      const url = '/api/company/profile'
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
        throw new Error(errorData.error || 'Failed to save company profile')
      }

      // Show success message
      toast.success(
        mode === 'create'
          ? 'Company profile created successfully'
          : 'Company profile updated successfully',
        `Company profile for ${data.companyName || ''} has been saved`
      )
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(
        mode === 'create' ? 'Failed to create company profile' : 'Failed to update company profile',
        errorMessage
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      <CompanyProfileForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        mode={mode}
      />
    </>
  )
}


