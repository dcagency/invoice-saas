'use client'

import { useState, FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface ClientFormProps {
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
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export default function ClientForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: ClientFormProps) {
  const [formData, setFormData] = useState({
    companyName: initialData?.companyName || '',
    contactName: initialData?.contactName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    streetAddress: initialData?.streetAddress || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    postalCode: initialData?.postalCode || '',
    country: initialData?.country || '',
    taxId: initialData?.taxId || '',
    notes: initialData?.notes || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }

    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1 - Basic Information */}
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-foreground">
              Company Name <span className="text-error ml-1">*</span>
            </label>
            <Input
              type="text"
              id="companyName"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleChange}
              disabled={isLoading}
              className={`mt-1 ${
                errors.companyName ? 'border-error focus-visible:ring-error' : ''
              }`}
            />
            {errors.companyName && (
              <p className="mt-1 text-xs text-error">{errors.companyName}</p>
            )}
          </div>

          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-foreground">
              Contact Person
            </label>
            <Input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`mt-1 ${
                errors.email ? 'border-error focus-visible:ring-error' : ''
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-error">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground">
              Phone
            </label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Section 2 - Address */}
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-medium text-foreground">Address</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="streetAddress" className="block text-sm font-medium text-foreground">
              Street Address
            </label>
            <Input
              type="text"
              id="streetAddress"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-foreground">
                City
              </label>
              <Input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-foreground">
                State/Province
              </label>
              <Input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-foreground">
                Postal Code
              </label>
              <Input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-foreground">
                Country
              </label>
              <Input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 - Additional Information */}
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-medium text-foreground">Additional Information</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="taxId" className="block text-sm font-medium text-foreground">
              Tax ID / VAT Number
            </label>
            <Input
              type="text"
              id="taxId"
              name="taxId"
              value={formData.taxId}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-foreground">
              Notes
            </label>
            <Textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? 'Saving...'
            : initialData
            ? 'Save Changes'
            : 'Save Client'}
        </Button>
      </div>
    </form>
  )
}


