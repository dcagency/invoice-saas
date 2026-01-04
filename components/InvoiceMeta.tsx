'use client'

import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'

interface InvoiceMetaProps {
  notes: string
  status: 'DRAFT' | 'SENT' | 'PAID'
  isLoading: boolean
  onChange: (field: 'notes' | 'status', value: string) => void
}

export default function InvoiceMeta({
  notes,
  status,
  isLoading,
  onChange,
}: InvoiceMetaProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-foreground mb-4">Additional Information</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-foreground">
            Notes
          </label>
          <Textarea
            id="notes"
            rows={4}
            value={notes}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="Payment terms, thank you message, etc."
            className="mt-1"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-foreground">
            Status
          </label>
          <Select
            id="status"
            value={status}
            onChange={(e) => onChange('status', e.target.value)}
            className="mt-1"
            disabled={isLoading}
          >
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="PAID">Paid</option>
          </Select>
        </div>
      </div>
    </div>
  )
}


