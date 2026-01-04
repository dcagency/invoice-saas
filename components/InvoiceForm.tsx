'use client'

import { useState, useEffect, useMemo } from 'react'
import InvoiceLineItems from './InvoiceLineItems'
import InvoiceTotalsDisplay from './InvoiceTotalsDisplay'
import InvoiceHeader from './InvoiceHeader'
import InvoiceMeta from './InvoiceMeta'
import InvoiceActions from './InvoiceActions'
import {
  calculateLineTotal,
  calculateSubtotal,
  calculateTaxAmount,
  calculateTotal,
} from '@/lib/invoice-calculations'

interface Client {
  id: string
  companyName: string
}

interface LineItem {
  description: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

interface InvoiceFormProps {
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
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
  nextInvoiceNumber?: string | null
  basedOn?: string | null
  isLoadingSuggestion?: boolean
}

/**
 * Initialize form data from initialData or defaults
 */
function initializeFormData(
  initialData: InvoiceFormProps['initialData'],
  nextInvoiceNumber?: string | null
) {
  const today = new Date().toISOString().split('T')[0]
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  return {
    clientId: initialData?.clientId || '',
    invoiceNumber: initialData?.invoiceNumber || nextInvoiceNumber || '',
    issueDate: initialData?.issueDate
      ? new Date(initialData.issueDate).toISOString().split('T')[0]
      : today,
    dueDate: initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split('T')[0]
      : dueDate,
    status: initialData?.status || 'DRAFT',
    taxRate: initialData?.taxRate ?? null,
    notes: initialData?.notes || '',
    lineItems:
      initialData?.lineItems.map((item) => {
        const quantity = typeof item.quantity === 'string' ? parseFloat(item.quantity) : item.quantity
        const unitPrice =
          typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice
        return {
          description: item.description,
          quantity,
          unitPrice,
          lineTotal: calculateLineTotal(quantity, unitPrice),
        }
      }) || [
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
          lineTotal: 0,
        },
      ],
  }
}

export default function InvoiceForm({
  initialData,
  clients,
  onSubmit,
  onCancel,
  isLoading,
  mode,
  nextInvoiceNumber,
  basedOn,
  isLoadingSuggestion = false,
}: InvoiceFormProps) {
  // ===== STATE MANAGEMENT =====
  const [formData, setFormData] = useState(() =>
    initializeFormData(initialData, nextInvoiceNumber)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  // ===== EFFECTS =====
  useEffect(() => {
    if (nextInvoiceNumber && mode === 'create' && !initialData) {
      setFormData((prev) => ({ ...prev, invoiceNumber: nextInvoiceNumber }))
    }
  }, [nextInvoiceNumber, mode, initialData])

  // ===== CALCULATIONS =====
  const totals = useMemo(() => {
    const subtotal = calculateSubtotal(formData.lineItems)
    const taxAmount = calculateTaxAmount(subtotal, formData.taxRate)
    const total = calculateTotal(subtotal, taxAmount)
    return { subtotal, taxAmount, total }
  }, [formData.lineItems, formData.taxRate])

  // ===== FIELD HANDLERS =====
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // ===== LINE ITEM HANDLERS =====
  const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    setFormData((prev) => {
      const newLineItems = [...prev.lineItems]
      newLineItems[index] = {
        ...newLineItems[index],
        [field]: value,
      }
      // Recalculate line total when quantity or unitPrice changes
      if (field === 'quantity' || field === 'unitPrice') {
        const quantity = field === 'quantity' ? (value as number) : newLineItems[index].quantity
        const unitPrice = field === 'unitPrice' ? (value as number) : newLineItems[index].unitPrice
        newLineItems[index].lineTotal = calculateLineTotal(quantity, unitPrice)
      }
      return { ...prev, lineItems: newLineItems }
    })
  }

  const handleAddLineItem = () => {
    setFormData((prev) => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
          lineTotal: 0,
        },
      ],
    }))
  }

  const handleRemoveLineItem = (index: number) => {
    if (formData.lineItems.length > 1) {
      setFormData((prev) => ({
        ...prev,
        lineItems: prev.lineItems.filter((_, i) => i !== index),
      }))
    }
  }

  // ===== VALIDATION =====
  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.clientId) {
      newErrors.clientId = 'Client is required'
    }
    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Invoice number is required'
    }
    if (formData.lineItems.length === 0) {
      newErrors.lineItems = 'At least one line item is required'
    }

    formData.lineItems.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`lineItem_${index}_description`] = 'Description is required'
      }
      if (item.quantity <= 0) {
        newErrors[`lineItem_${index}_quantity`] = 'Quantity must be greater than 0'
      }
      if (item.unitPrice < 0) {
        newErrors[`lineItem_${index}_unitPrice`] = 'Unit price must be >= 0'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ===== SUBMIT HANDLER =====
  const handleSubmit = async (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    const submitData = {
      clientId: formData.clientId,
      invoiceNumber: formData.invoiceNumber,
      issueDate: new Date(formData.issueDate).toISOString(),
      dueDate: new Date(formData.dueDate).toISOString(),
      status: saveAsDraft ? 'DRAFT' : formData.status,
      taxRate: formData.taxRate,
      notes: formData.notes || null,
      lineItems: formData.lineItems.map((item, index) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        sortOrder: index,
      })),
    }

    await onSubmit(submitData)
  }

  // ===== RENDER =====
  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
      <InvoiceHeader
        clientId={formData.clientId}
        clients={clients}
        invoiceNumber={formData.invoiceNumber}
        issueDate={formData.issueDate}
        dueDate={formData.dueDate}
        errors={errors}
        isLoading={isLoading}
        onChange={handleChange}
        suggestedInvoiceNumber={nextInvoiceNumber}
        basedOn={basedOn}
      />

      <InvoiceLineItems
        items={formData.lineItems}
        onItemChange={handleLineItemChange}
        onAdd={handleAddLineItem}
        onRemove={handleRemoveLineItem}
        canRemove={formData.lineItems.length > 1}
      />

      <InvoiceTotalsDisplay
        subtotal={totals.subtotal}
        taxRate={formData.taxRate}
        taxAmount={totals.taxAmount}
        total={totals.total}
        editable={true}
        onTaxRateChange={(rate) => handleChange('taxRate', rate)}
      />

      <InvoiceMeta
        notes={formData.notes}
        status={formData.status}
        isLoading={isLoading}
        onChange={(field, value) => handleChange(field, value)}
      />

      <InvoiceActions
        mode={mode}
        isLoading={isLoading}
        onCancel={onCancel}
        onSave={() => {}} // Not used - form onSubmit handles this
        onSaveDraft={(e) => handleSubmit(e, true)}
      />
    </form>
  )
}

