import { Decimal } from '@prisma/client/runtime/library'

/**
 * Format a date for display in PDF
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Format a currency amount with 2 decimals
 */
export function formatCurrency(amount: number | string | Decimal | null | undefined): string {
  if (amount === null || amount === undefined) return '0.00'
  const num = typeof amount === 'number' ? amount : typeof amount === 'string' ? parseFloat(amount) : Number(amount)
  return num.toFixed(2)
}

/**
 * Format a number, removing trailing zeros
 */
export function formatNumber(num: number | string | Decimal): string {
  const n = typeof num === 'number' ? num : typeof num === 'string' ? parseFloat(num) : Number(num)
  return n.toString().replace(/\.?0+$/, '')
}

/**
 * Check if an invoice is overdue
 */
export function isOverdue(invoice: { dueDate: Date | string; status: string }): boolean {
  if (invoice.status === 'PAID') return false
  const now = new Date()
  const dueDate = new Date(invoice.dueDate)
  return dueDate < now
}


