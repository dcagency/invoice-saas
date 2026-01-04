'use client'

import LineItemRow from './LineItemRow'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

interface LineItem {
  description: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

interface InvoiceLineItemsProps {
  items: LineItem[]
  onItemChange: (index: number, field: keyof LineItem, value: number | string) => void
  onAdd: () => void
  onRemove: (index: number) => void
  canRemove: boolean
}

export default function InvoiceLineItems({
  items,
  onItemChange,
  onAdd,
  onRemove,
  canRemove,
}: InvoiceLineItemsProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-foreground mb-4">Items</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead className="text-right">Line Total</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <LineItemRow
                key={index}
                index={index}
                value={item}
                onChange={onItemChange}
                onRemove={onRemove}
                canRemove={canRemove}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <Button
        type="button"
        onClick={onAdd}
        className="mt-4"
      >
        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Line Item
      </Button>
    </div>
  )
}


