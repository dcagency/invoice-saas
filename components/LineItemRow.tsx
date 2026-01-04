'use client'

import { Input } from '@/components/ui/input'
import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

interface LineItem {
  description: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

interface LineItemRowProps {
  index: number
  value: LineItem
  onChange: (index: number, field: keyof LineItem, value: string | number) => void
  onRemove: (index: number) => void
  canRemove: boolean
}

export default function LineItemRow({
  index,
  value,
  onChange,
  onRemove,
  canRemove,
}: LineItemRowProps) {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0
    onChange(index, 'quantity', newValue)
  }

  const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0
    onChange(index, 'unitPrice', newValue)
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(index, 'description', e.target.value)
  }

  // Calculate line total
  const lineTotal = (value.quantity * value.unitPrice).toFixed(2)

  return (
    <TableRow>
      <TableCell>
        <Input
          type="text"
          value={value.description}
          onChange={handleDescriptionChange}
          placeholder="Product or service description"
          className="w-full text-sm"
          required
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min="0"
          step="0.001"
          value={value.quantity}
          onChange={handleQuantityChange}
          placeholder="1"
          className="w-20 text-sm"
          required
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={value.unitPrice}
          onChange={handleUnitPriceChange}
          placeholder="0.00"
          className="w-24 text-right text-sm"
          required
        />
      </TableCell>
      <TableCell className="text-right text-sm font-medium text-foreground">
        {lineTotal}
      </TableCell>
      <TableCell>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          disabled={!canRemove}
          className="text-error hover:text-error/80"
          aria-label="Remove line item"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </TableCell>
    </TableRow>
  )
}


