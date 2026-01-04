'use client'

import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

interface InvoiceHeaderProps {
  clientId: string
  clients: { id: string; companyName: string }[]
  invoiceNumber: string
  issueDate: string
  dueDate: string
  errors: Record<string, string>
  isLoading: boolean
  onChange: (field: string, value: string) => void
  suggestedInvoiceNumber?: string | null
  basedOn?: string | null
}

export default function InvoiceHeader({
  clientId,
  clients,
  invoiceNumber,
  issueDate,
  dueDate,
  errors,
  isLoading,
  onChange,
  suggestedInvoiceNumber,
  basedOn,
}: InvoiceHeaderProps) {
  const handleIssueDateChange = (value: string) => {
    onChange('issueDate', value)
    // Auto-update dueDate to +30 days when issueDate changes
    const issueDateObj = new Date(value)
    const dueDateObj = new Date(issueDateObj)
    dueDateObj.setDate(dueDateObj.getDate() + 30)
    onChange('dueDate', dueDateObj.toISOString().split('T')[0])
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-foreground mb-4">Invoice Header</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-foreground">
            Client <span className="text-error ml-1">*</span>
          </label>
          <Select
            id="clientId"
            value={clientId}
            onChange={(e) => onChange('clientId', e.target.value)}
            className={`mt-1 ${
              errors.clientId ? 'border-error focus-visible:ring-error' : ''
            }`}
            required
            disabled={isLoading}
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.companyName}
              </option>
            ))}
          </Select>
          {errors.clientId && (
            <p className="mt-1 text-sm text-error">{errors.clientId}</p>
          )}
          {clients.length === 0 && (
            <p className="mt-1 text-sm text-muted-foreground">
              No clients found.{' '}
              <a href="/clients/new" className="text-primary hover:text-primary-hover">
                Add a client
              </a>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="invoiceNumber" className="block text-sm font-medium text-foreground">
              Invoice Number <span className="text-error ml-1">*</span>
            </label>
            <Input
              type="text"
              id="invoiceNumber"
              value={invoiceNumber}
              onChange={(e) => onChange('invoiceNumber', e.target.value)}
              className={`mt-1 ${
                errors.invoiceNumber ? 'border-error focus-visible:ring-error' : ''
              }`}
              required
              disabled={isLoading}
            />
            {errors.invoiceNumber && (
              <p className="mt-1 text-sm text-error">{errors.invoiceNumber}</p>
            )}
            {suggestedInvoiceNumber && invoiceNumber === suggestedInvoiceNumber && (
              <p className="mt-1 text-xs text-muted-foreground">
                Suggested based on your last invoice{basedOn ? ` (${basedOn})` : ''}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="issueDate" className="block text-sm font-medium text-foreground">
              Issue Date <span className="text-error ml-1">*</span>
            </label>
            <Input
              type="date"
              id="issueDate"
              value={issueDate}
              onChange={(e) => handleIssueDateChange(e.target.value)}
              className="mt-1"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-foreground">
              Due Date <span className="text-error ml-1">*</span>
            </label>
            <Input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => onChange('dueDate', e.target.value)}
              className="mt-1"
              required
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}


