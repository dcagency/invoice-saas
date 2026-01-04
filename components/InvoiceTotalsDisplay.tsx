'use client'

import { Input } from '@/components/ui/input'

interface InvoiceTotalsDisplayProps {
  subtotal: number
  taxRate: number | null
  taxAmount: number
  total: number
  editable?: boolean
  onTaxRateChange?: (rate: number | null) => void
}

export default function InvoiceTotalsDisplay({
  subtotal,
  taxRate,
  taxAmount,
  total,
  editable = false,
  onTaxRateChange,
}: InvoiceTotalsDisplayProps) {
  /**
   * Format a number to currency format with exactly 2 decimal places.
   * This is the single source of truth for currency formatting in totals.
   */
  const formatCurrency = (amount: number): string => {
    // Ensure we have a valid number
    const num = typeof amount === 'number' && !isNaN(amount) ? amount : 0
    return num.toFixed(2)
  }

  /**
   * Format tax rate for display (handles null gracefully).
   */
  const formatTaxRate = (rate: number | null): string => {
    if (rate === null || rate === undefined || isNaN(rate)) {
      return '0.00'
    }
    // Format to 2 decimals, removing trailing zeros if whole number
    const formatted = rate.toFixed(2)
    return formatted.endsWith('.00') ? rate.toFixed(0) : formatted
  }

  /**
   * Handle tax rate input change.
   * Converts empty string to null, otherwise parses to number.
   */
  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    if (value === '' || value === '-') {
      onTaxRateChange?.(null)
    } else {
      const parsed = parseFloat(value)
      if (!isNaN(parsed)) {
        // Clamp between 0 and 100
        const clamped = Math.max(0, Math.min(100, parsed))
        onTaxRateChange?.(clamped)
      }
    }
  }

  // Determine if tax should be displayed
  const shouldShowTax = editable || (taxRate !== null && taxRate !== undefined && taxRate > 0)

  return (
    <div className="mt-6 flex justify-end">
      <div className="w-full max-w-xs">
        <div className="space-y-2">
          {/* Subtotal - Always displayed */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
          </div>

          {/* Tax Section */}
          {editable ? (
            // Editable mode: show input for tax rate
            <div className="flex items-center justify-between">
              <label htmlFor="taxRate" className="text-sm text-muted-foreground">
                Tax Rate (%):
              </label>
              <Input
                type="number"
                id="taxRate"
                min="0"
                max="100"
                step="0.01"
                value={taxRate === null || taxRate === undefined ? '' : taxRate}
                onChange={handleTaxRateChange}
                placeholder="0.00"
                className="w-24 text-right text-sm"
                aria-label="Tax rate percentage"
              />
            </div>
          ) : shouldShowTax ? (
            // Read-only mode: show tax line if tax rate exists and > 0
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax ({formatTaxRate(taxRate)}%):</span>
              <span className="font-medium text-foreground">{formatCurrency(taxAmount)}</span>
            </div>
          ) : null}

          {/* Total - Always displayed */}
          <div className="border-t border-border pt-2">
            <div className="flex justify-between">
              <span className="text-base font-semibold text-foreground">Total:</span>
              <span className="text-lg font-bold text-foreground">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

