import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import PDFDocument from 'pdfkit'
import { generateInvoicePDF } from '@/lib/pdf/invoice-generator'
import { isValidCuid } from '@/lib/api/validators'
import { handleApiError } from '@/lib/api/error-handler'

// GET /api/invoices/[id]/pdf - Generate and download invoice PDF
export async function GET(
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
        { error: 'Invalid invoice ID format', code: 'VALIDATION_ERROR' },
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
        { error: 'Company profile required to generate PDF', code: 'COMPANY_PROFILE_MISSING' },
        { status: 400 }
      )
    }

    // Handle deleted client gracefully (use placeholder if client was deleted)
    let clientInfo = invoice.client
    if (!clientInfo) {
      // Client was deleted - use placeholder
      clientInfo = {
        companyName: '[Client Deleted]',
        contactName: null,
        email: null,
        streetAddress: null,
        city: null,
        state: null,
        postalCode: null,
        country: null,
        taxId: null,
      }
    }

    // Create invoice object with client info (may be placeholder)
    const invoiceWithClient = {
      ...invoice,
      client: clientInfo,
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    })

    // Collect PDF chunks
    const chunks: Buffer[] = []
    doc.on('data', (chunk: Buffer) => chunks.push(chunk))

    // Generate PDF content (with client info or placeholder)
    generateInvoicePDF(doc, invoiceWithClient)

    // End document
    doc.end()

    // Wait for PDF to finish generating
    await new Promise<void>((resolve) => {
      doc.on('end', () => resolve())
    })

    // Combine chunks into single buffer
    const pdfBuffer = Buffer.concat(chunks)

    // Sanitize invoice number for filename
    const sanitizedInvoiceNumber = invoice.invoiceNumber.replace(/[^a-zA-Z0-9-_]/g, '_')
    const filename = `Invoice-${sanitizedInvoiceNumber}.pdf`

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-store, must-revalidate',
      },
    })
  } catch (error) {
    return handleApiError(error, 'GET /api/invoices/[id]/pdf')
  }
}


