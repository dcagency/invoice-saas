// Helper functions to convert Prisma Decimal to number for client components
import { Decimal } from '@prisma/client/runtime/library'

export function decimalToNumber(value: Decimal | null | undefined): number | null {
  if (value === null || value === undefined) return null
  return parseFloat(value.toString())
}

export function decimalToNumberOrZero(value: Decimal | null | undefined): number {
  if (value === null || value === undefined) return 0
  return parseFloat(value.toString())
}

