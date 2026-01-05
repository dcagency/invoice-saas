import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendInvoiceEmail } from '@/lib/email/resend-client'
import { generateInvoicePDFBuffer } from '@/lib/pdf/invoice-generator'
import { decimalToNumberOrZero } from '@/lib/prisma-helpers'
import { isValidCuid } from '@/lib/api/validators'
import { handleApiError } from '@/lib/api/error-handler'
import { toCompanyProfileDTO } from '@/lib/mappers/companyProfile'

export const runtime = 'nodejs'

const sendEmailSchema = z.object({
  recipientEmail: z.string().email('Invalid email format'),
  customMessage: z.string().min(1, 'Message is required').max(2000, 'Message too long'),
})

// POST /api/invoices/[id]/send-email - Send invoice by email
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate ID format
    if (!isValidCuid(params.id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid invoice ID format', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // CRITICAL: Fetch invoice with ownership check
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: params.id,
        userId, // CRITICAL: ownership check
      },
      include: {
        client: true,
        lineItems: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
        user: {
          include: {
            companyProfile: true,
          },
        },
      },
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    if (!invoice.user.companyProfile) {
      return NextResponse.json(
        { success: false, error: 'Company profile required to send email', code: 'COMPANY_PROFILE_MISSING' },
        { status: 400 }
      )
    }

    // CRITICAL: Verify client still exists (prevent sending email to deleted client)
    const client = await prisma.client.findFirst({
      where: {
        id: invoice.clientId,
        userId, // CRITICAL: ownership check
      },
    })

    if (!client) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot send email: client no longer exists',
          code: 'CLIENT_DELETED',
        },
        { status: 400 }
      )
    }

    // Validate request body
    const body = await request.json()
    const validatedData = sendEmailSchema.parse(body)

    // Generate PDF buffer using verified client (not invoice.client which may be null)
    const pdfBuffer = await generateInvoicePDFBuffer({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      status: invoice.status,
      subtotal: decimalToNumberOrZero(invoice.subtotal),
      taxPercentage: invoice.taxPercentage,
      taxAmount: invoice.taxAmount,
      totalAmount: decimalToNumberOrZero(invoice.totalAmount),
      notes: invoice.notes,
      client: {
        companyName: client.companyName,
        contactName: client.contactName,
        email: client.email,
        streetAddress: client.streetAddress,
        city: client.city,
        state: client.state,
        postalCode: client.postalCode,
        country: client.country,
        taxId: client.taxId,
      },
      lineItems: invoice.lineItems.map((item) => ({
        description: item.description,
        quantity: decimalToNumberOrZero(item.quantity),
        unitPrice: decimalToNumberOrZero(item.unitPrice),
        lineTotal: decimalToNumberOrZero(item.lineTotal),
      })),
      user: {
        companyProfile: toCompanyProfileDTO(invoice.user.companyProfile),
      },
    })

    // Build email content
    const companyName = invoice.user.companyProfile.companyName || 'Your Company'
    const subject = `Invoice #${invoice.invoiceNumber} from ${companyName}`

    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString()
    }

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
    }

    const emailBody = `${validatedData.customMessage}

---
Invoice Details:
- Invoice Number: ${invoice.invoiceNumber}
- Issue Date: ${formatDate(invoice.issueDate)}
- Due Date: ${formatDate(invoice.dueDate)}
- Amount: ${formatCurrency(decimalToNumberOrZero(invoice.totalAmount))}

Please find the invoice attached as a PDF.

${companyName}${invoice.user.companyProfile.streetAddress ? `\n${invoice.user.companyProfile.streetAddress}` : ''}${invoice.user.companyProfile.city || invoice.user.companyProfile.postalCode || invoice.user.companyProfile.country ? `\n${[invoice.user.companyProfile.city, invoice.user.companyProfile.postalCode, invoice.user.companyProfile.country].filter(Boolean).join(', ')}` : ''}`

    // Sanitize invoice number for filename
    const sanitizedInvoiceNumber = invoice.invoiceNumber.replace(/[^a-zA-Z0-9-_]/g, '_')
    const pdfFilename = `Invoice-${sanitizedInvoiceNumber}.pdf`

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email service is not configured. Please set RESEND_API_KEY in environment variables.',
          code: 'EMAIL_SERVICE_NOT_CONFIGURED',
        },
        { status: 500 }
      )
    }

    // Send email
    await sendInvoiceEmail({
      to: validatedData.recipientEmail,
      subject,
      textBody: emailBody,
      pdfBuffer,
      pdfFilename,
    })

    return NextResponse.json({
      success: true,
      message: `Email sent successfully to ${validatedData.recipientEmail}`,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', code: 'VALIDATION_ERROR', details: error.errors },
        { status: 400 }
      )
    }
    return handleApiError(error, 'POST /api/invoices/[id]/send-email')
  }
}

