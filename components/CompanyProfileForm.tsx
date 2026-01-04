'use client'

import { useState, FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface CompanyProfileFormProps {
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
  onSubmit: (data: any) => Promise<void>
  onCancel?: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export default function CompanyProfileForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: CompanyProfileFormProps) {
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
    } else if (formData.companyName.trim().length < 2) {
      newErrors.companyName = 'Company name must be at least 2 characters'
    } else if (formData.companyName.trim().length > 200) {
      newErrors.companyName = 'Company name must be at most 200 characters'
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section 1 - Company Information */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">
          Company Information
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-foreground"
            >
              Company Name <span className="text-error ml-1">*</span>
            </label>
            <Input
              type="text"
              id="companyName"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Acme Inc."
              className={`mt-1 ${
                errors.companyName ? 'border-error focus-visible:ring-error' : ''
              }`}
              disabled={isLoading}
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-error">{errors.companyName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="taxId"
              className="block text-sm font-medium text-foreground"
            >
              Tax ID / VAT Number
            </label>
            <Input
              type="text"
              id="taxId"
              name="taxId"
              value={formData.taxId}
              onChange={handleChange}
              placeholder="FR12345678901"
              className="mt-1"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Enter your VAT number, SIRET, or other tax identification number
            </p>
          </div>
        </div>
      </div>

      {/* Section 2 - Contact Information */}
      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-medium text-foreground mb-4">
          Contact Information
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="contactName"
              className="block text-sm font-medium text-foreground"
            >
              Contact Person
            </label>
            <Input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="John Doe"
              className="mt-1"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              Email
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@acme.com"
              className={`mt-1 ${
                errors.email ? 'border-error focus-visible:ring-error' : ''
              }`}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-foreground"
            >
              Phone
            </label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+33 1 23 45 67 89"
              className="mt-1"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Section 3 - Company Address */}
      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-medium text-foreground mb-4">
          Company Address
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            (Required for invoices)
          </span>
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="streetAddress"
              className="block text-sm font-medium text-foreground"
            >
              Street Address <span className="text-error ml-1">*</span>
            </label>
            <Input
              type="text"
              id="streetAddress"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              placeholder="123 Main Street"
              className="mt-1"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-foreground"
            >
              City <span className="text-error ml-1">*</span>
            </label>
            <Input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Paris"
              className="mt-1"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-foreground"
            >
              State/Province
            </label>
            <Input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Île-de-France"
              className="mt-1"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium text-foreground"
              >
                Postal Code <span className="text-error ml-1">*</span>
              </label>
              <Input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="75001"
                className="mt-1"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-foreground"
              >
                Country <span className="text-error ml-1">*</span>
              </label>
              <Input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="France"
                className="mt-1"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t border-border">
        {mode === 'edit' && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? 'Saving...'
            : mode === 'create'
            ? 'Save and Continue'
            : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}


