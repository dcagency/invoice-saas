'use client'

import { Button } from '@/components/ui/button'

interface InvoiceActionsProps {
  mode: 'create' | 'edit'
  isLoading: boolean
  onCancel: () => void
  onSave: () => void
  onSaveDraft: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export default function InvoiceActions({
  mode,
  isLoading,
  onCancel,
  onSave,
  onSaveDraft,
}: InvoiceActionsProps) {
  return (
    <div className="flex justify-end gap-4 pt-6 border-t border-border">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
      {mode === 'create' && (
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          disabled={isLoading}
        >
          Save as Draft
        </Button>
      )}
      <Button
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : mode === 'create' ? 'Save' : 'Save Changes'}
      </Button>
    </div>
  )
}

