// lib/invoice-calculations.ts
// Browser-safe invoice calculations (no Prisma dependencies)

export type MoneyLike = number | string | null | undefined

export function toNumber(v: MoneyLike): number {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  if (typeof v === 'string') {
    const n = Number(v.replace(',', '.'))
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

export function calculateLineTotal(quantity: MoneyLike, unitPrice: MoneyLike): number {
  return round2(toNumber(quantity) * toNumber(unitPrice))
}

export function calculateSubtotal(
  items: Array<{ quantity: MoneyLike; unitPrice: MoneyLike }>
): number {
  return round2(
    items.reduce((acc, it) => acc + calculateLineTotal(it.quantity, it.unitPrice), 0)
  )
}

export function calculateTaxAmount(subtotal: MoneyLike, taxRate: MoneyLike | null): number {
  if (!taxRate || taxRate === 0) return 0
  const rate = toNumber(taxRate)
  const sub = toNumber(subtotal)
  return round2((sub * rate) / 100)
}

export function calculateTotal(subtotal: MoneyLike, taxAmount: MoneyLike): number {
  return round2(toNumber(subtotal) + toNumber(taxAmount))
}

export function calculateInvoiceTotals(
  items: Array<{ quantity: MoneyLike; unitPrice: MoneyLike }>,
  taxRate?: MoneyLike | null
) {
  const subtotal = calculateSubtotal(items)
  const taxAmount = calculateTaxAmount(subtotal, taxRate ?? null)
  const total = calculateTotal(subtotal, taxAmount)

  return { subtotal, taxAmount, total }
}