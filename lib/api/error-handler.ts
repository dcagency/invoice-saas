import { NextResponse } from 'next/server'

/**
 * Handle API errors consistently
 * Logs error server-side and returns generic error to client
 */
export function handleApiError(error: unknown, context: string): NextResponse {
  console.error(`API Error in ${context}:`, error)

  // Don't expose internal errors
  return NextResponse.json(
    { error: 'An error occurred. Please try again.', code: 'INTERNAL_ERROR' },
    { status: 500 }
  )
}

