import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { ToastProvider } from '@/components/ui/toast-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Invoice SaaS',
  description: 'Create, manage, and generate professional invoices',
  robots: {
    index: false, // Private app, don't index
    follow: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider defaultTheme="system">
            <ErrorBoundaryWrapper>
              {children}
              <ToastProvider />
            </ErrorBoundaryWrapper>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
