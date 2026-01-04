// Simple utility to merge class names
export function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs
    .filter(Boolean)
    .join(' ')
    .split(' ')
    .filter((v, i, a) => a.indexOf(v) === i)
    .join(' ')
}

