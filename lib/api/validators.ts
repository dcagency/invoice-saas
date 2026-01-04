/**
 * Validate CUID format
 * CUIDs start with 'c' followed by 24+ lowercase alphanumeric characters
 */
export function isValidCuid(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false
  }
  return /^c[a-z0-9]{24,}$/.test(id)
}

