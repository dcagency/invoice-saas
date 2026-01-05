'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Safe access to NODE_ENV (available at build time, not runtime in client components)
  const isDevelopment = typeof window !== 'undefined' && window.location.hostname === 'localhost'

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-foreground mb-4">500</h1>
        <p className="text-xl text-muted-foreground mb-6">Server error</p>
        <p className="text-muted-foreground mb-8">
          Something went wrong on our end. Please try again later.
        </p>
        {isDevelopment && error && (
          <pre className="text-xs text-error mb-4 p-4 bg-error/10 rounded overflow-auto max-w-2xl mx-auto border border-error/20">
            {error.message}
          </pre>
        )}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md shadow-sm text-foreground bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}


