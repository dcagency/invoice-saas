import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/api/error-handler'

// GET /api/invoices/next-number - Get suggested next invoice number
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find last invoice ordered by createdAt DESC
    const lastInvoice = await prisma.invoice.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { invoiceNumber: true },
    })

    if (!lastInvoice) {
      return NextResponse.json({ nextNumber: 'INV-001', basedOn: null })
    }

    // Extract prefix and trailing digits using regex /^(.*?)(\d+)$/
    const match = lastInvoice.invoiceNumber.match(/^(.*?)(\d+)$/)
    if (match) {
      const prefix = match[1]
      const numStr = match[2]
      const numLength = numStr.length
      const nextNum = parseInt(numStr, 10) + 1
      const nextNumStr = nextNum.toString().padStart(numLength, '0')
      const nextNumber = prefix + nextNumStr
      return NextResponse.json({ nextNumber, basedOn: lastInvoice.invoiceNumber })
    }

    // Default fallback if no trailing digits found
    return NextResponse.json({ nextNumber: 'INV-001', basedOn: lastInvoice.invoiceNumber })
  } catch (error) {
    return handleApiError(error, 'GET /api/invoices/next-number')
  }
}


