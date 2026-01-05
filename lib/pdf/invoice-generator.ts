import PDFDocument from 'pdfkit'
import { formatDate, formatCurrency, formatNumber, isOverdue } from './pdf-helpers'

// Type for PDFDocument instance
type PDFDocumentType = InstanceType<typeof PDFDocument>

/**
 * Client data structure used by PDF generation
 * Contains only the fields needed for PDF rendering
 */
export interface ClientPDFDTO {
  companyName: string
  contactName: string | null
  email: string | null
  streetAddress: string | null
  city: string | null
  state: string | null
  postalCode: string | null
  country: string | null
  taxId: string | null
}

interface InvoiceWithRelations {
  id: string
  invoiceNumber: string
  issueDate: Date | string
  dueDate: Date | string
  status: 'DRAFT' | 'SENT' | 'PAID'
  subtotal: number | string | any
  taxPercentage: number | string | any | null
  taxAmount: number | string | any | null
  totalAmount: number | string | any
  notes: string | null
  client: ClientPDFDTO
  lineItems: Array<{
    description: string
    quantity: number | string | any
    unitPrice: number | string | any
    lineTotal: number | string | any
  }>
  user: {
    companyProfile: {
      companyName: string
      contactName: string | null
      email: string | null
      phone: string | null
      streetAddress: string | null
      city: string | null
      state: string | null
      postalCode: string | null
      country: string | null
      taxId: string | null
    } | null
  }
}

export function generateInvoicePDF(doc: PDFDocumentType, invoice: InvoiceWithRelations): void {
  const { companyProfile } = invoice.user
  const { client, lineItems } = invoice

  if (!companyProfile) {
    throw new Error('Company profile is required')
  }

  // Track current page number (starts at 1)
  let currentPageIndex = 1
  const pageHeight = 792 // A4 height in points
  const footerY = pageHeight - 40

  // Helper function to write footer on current page
  const writeFooter = (pageNum: number, totalPages: number) => {
    doc.fontSize(8).font('Helvetica').fillColor('#666666')
    doc.text(
      'Thank you for your business',
      50,
      footerY,
      { align: 'center', width: 495 }
    )

    // Page number (if multi-page)
    if (totalPages > 1) {
      doc.text(
        `Page ${pageNum} of ${totalPages}`,
        50,
        footerY + 12,
        { align: 'center', width: 495 }
      )
    }
    doc.fillColor('#000000') // Reset color
  }

  // Track page count - will be updated as pages are added
  let totalPageCount = 1

  let yPosition = 40

  // --- HEADER: Company Information ---
  // Company name - large and bold
  doc.fontSize(24).font('Helvetica-Bold')
  doc.text(companyProfile.companyName || '', 50, yPosition, { width: 300 })
  yPosition += 35

  // Address section - medium font
  doc.fontSize(10).font('Helvetica')

  if (companyProfile.streetAddress) {
    doc.text(companyProfile.streetAddress, 50, yPosition)
    yPosition += 14
  }

  // City, State, Postal Code on one line
  const cityLine = [
    companyProfile.city,
    companyProfile.state,
    companyProfile.postalCode,
  ]
    .filter(Boolean)
    .join(', ')

  if (cityLine) {
    doc.text(cityLine, 50, yPosition)
    yPosition += 14
  }

  if (companyProfile.country) {
    doc.text(companyProfile.country, 50, yPosition)
    yPosition += 14
  }

  // Contact info - slightly smaller, with labels
  yPosition += 6 // Extra spacing
  doc.fontSize(9)

  if (companyProfile.email) {
    doc.text(`Email: ${companyProfile.email}`, 50, yPosition)
    yPosition += 12
  }

  if (companyProfile.phone) {
    doc.text(`Phone: ${companyProfile.phone}`, 50, yPosition)
    yPosition += 12
  }

  if (companyProfile.taxId) {
    doc.text(`Tax ID: ${companyProfile.taxId}`, 50, yPosition)
    yPosition += 12
  }

  yPosition += 20 // Spacing before invoice title

  // Horizontal line separator (subtle)
  doc.strokeColor('#CCCCCC').lineWidth(1)
  doc.moveTo(50, yPosition).lineTo(545, yPosition).stroke()
  yPosition += 20

  // --- INVOICE TITLE AND INFO ---
  // "INVOICE" title - large, right-aligned
  doc.fontSize(32).font('Helvetica-Bold').fillColor('#000000')
  doc.text('INVOICE', 400, yPosition, { align: 'right', width: 145 })
  yPosition += 45

  // Invoice details - right-aligned block
  doc.fontSize(11).font('Helvetica-Bold')
  doc.text('Invoice Number:', 400, yPosition, { continued: true, width: 90 })
  doc.font('Helvetica').text(` ${invoice.invoiceNumber}`, { align: 'right', width: 55 })
  yPosition += 16

  doc.font('Helvetica-Bold')
  doc.text('Issue Date:', 400, yPosition, { continued: true, width: 90 })
  doc.font('Helvetica').text(` ${formatDate(invoice.issueDate)}`, { align: 'right', width: 55 })
  yPosition += 16

  doc.font('Helvetica-Bold')
  doc.text('Due Date:', 400, yPosition, { continued: true, width: 90 })
  doc.font('Helvetica').text(` ${formatDate(invoice.dueDate)}`, { align: 'right', width: 55 })
  yPosition += 16

  // Overdue badge if applicable (using gray instead of red for black & white design)
  if (isOverdue(invoice)) {
    doc.fontSize(10).fillColor('#666666')
    doc.text('OVERDUE', 400, yPosition, { width: 145, align: 'right' })
    doc.fillColor('#000000') // Reset color
    yPosition += 16
  }

  yPosition += 25

  // --- BILL TO SECTION ---
  // "Bill To" label - bold
  doc.fontSize(12).font('Helvetica-Bold')
  doc.text('Bill To:', 50, yPosition)
  yPosition += 18

  // Client company name - medium bold
  doc.fontSize(11).font('Helvetica-Bold')
  doc.text(client.companyName || '', 50, yPosition)
  yPosition += 16

  // Client details - regular font
  doc.fontSize(10).font('Helvetica')

  if (client.contactName) {
    doc.text(client.contactName, 50, yPosition)
    yPosition += 14
  }

  if (client.streetAddress) {
    doc.text(client.streetAddress, 50, yPosition)
    yPosition += 14
  }

  const clientCityLine = [client.city, client.state, client.postalCode]
    .filter(Boolean)
    .join(', ')

  if (clientCityLine) {
    doc.text(clientCityLine, 50, yPosition)
    yPosition += 14
  }

  if (client.country) {
    doc.text(client.country, 50, yPosition)
    yPosition += 14
  }

  if (client.email) {
    doc.fontSize(9).text(`Email: ${client.email}`, 50, yPosition)
    yPosition += 12
  }

  if (client.taxId) {
    doc.fontSize(9).text(`Tax ID: ${client.taxId}`, 50, yPosition)
    yPosition += 12
  }

  yPosition += 25 // Spacing before line items table

  // --- LINE ITEMS TABLE ---
  const tableTop = yPosition
  const descriptionX = 55
  const quantityX = 320
  const unitPriceX = 395
  const lineTotalX = 470

  // Table header with background
  doc.fillColor('#F5F5F5')
  doc.rect(50, tableTop, 495, 22).fill()
  doc.fillColor('#000000')

  // Column headers - bold, slightly larger
  doc.fontSize(10).font('Helvetica-Bold')
  doc.text('Description', descriptionX, tableTop + 6, { width: 260 })
  doc.text('Quantity', quantityX, tableTop + 6, { width: 70, align: 'right' })
  doc.text('Unit Price', unitPriceX, tableTop + 6, { width: 70, align: 'right' })
  doc.text('Amount', lineTotalX, tableTop + 6, { width: 70, align: 'right' })

  yPosition = tableTop + 28

  // Table rows
  doc.fontSize(10).font('Helvetica')
  lineItems.forEach((item, index) => {
    // Check if we need a new page
    if (yPosition > 720) {
      // Write footer on current page before adding new page
      // Get current page count before adding new page
      totalPageCount = doc.bufferedPageRange().count
      writeFooter(currentPageIndex, totalPageCount)

      // Add new page (this increments the total page count)
      doc.addPage()
      currentPageIndex++
      totalPageCount = doc.bufferedPageRange().count
      yPosition = 50

      // Repeat table header on new page
      doc.fillColor('#F5F5F5')
      doc.rect(50, yPosition, 495, 22).fill()
      doc.fillColor('#000000')
      doc.fontSize(10).font('Helvetica-Bold')
      doc.text('Description', descriptionX, yPosition + 6, { width: 260 })
      doc.text('Quantity', quantityX, yPosition + 6, { width: 70, align: 'right' })
      doc.text('Unit Price', unitPriceX, yPosition + 6, { width: 70, align: 'right' })
      doc.text('Amount', lineTotalX, yPosition + 6, { width: 70, align: 'right' })
      yPosition += 28
    }

    // Alternating row background (very subtle)
    if (index % 2 === 1) {
      doc.fillColor('#FAFAFA')
      doc.rect(50, yPosition - 4, 495, 20).fill()
      doc.fillColor('#000000')
    }

    // Description (left-aligned, can wrap)
    doc.text(item.description || '', descriptionX, yPosition, { width: 260 })

    // Quantity (right-aligned)
    doc.text(formatNumber(item.quantity), quantityX, yPosition, { width: 70, align: 'right' })

    // Unit price (right-aligned, currency format)
    doc.text(formatCurrency(item.unitPrice), unitPriceX, yPosition, { width: 70, align: 'right' })

    // Line total (right-aligned, currency format)
    doc.text(formatCurrency(item.lineTotal), lineTotalX, yPosition, { width: 70, align: 'right' })

    yPosition += 22 // Row height

    // Separator line between rows (subtle)
    doc.strokeColor('#EEEEEE').lineWidth(0.5)
    doc.moveTo(50, yPosition - 2).lineTo(545, yPosition - 2).stroke()
    doc.strokeColor('#000000') // Reset
  })

  yPosition += 10 // Spacing after table

  // --- TOTALS SECTION ---
  // Horizontal line before totals
  doc.strokeColor('#CCCCCC').lineWidth(1)
  doc.moveTo(350, yPosition).lineTo(545, yPosition).stroke()
  yPosition += 15

  // Totals - right-aligned
  const totalsX = 395
  const amountX = 470

  doc.fontSize(10).font('Helvetica')

  // Subtotal
  doc.text('Subtotal:', totalsX, yPosition, { width: 70, align: 'right' })
  doc.text(formatCurrency(invoice.subtotal), amountX, yPosition, { width: 70, align: 'right' })
  yPosition += 16

  const taxPercentage = invoice.taxPercentage
    ? typeof invoice.taxPercentage === 'number'
      ? invoice.taxPercentage
      : typeof invoice.taxPercentage === 'string'
      ? parseFloat(invoice.taxPercentage)
      : Number(invoice.taxPercentage)
    : null

  // Tax (if applicable)
  if (taxPercentage && taxPercentage > 0 && invoice.taxAmount) {
    doc.text(`Tax (${taxPercentage}%):`, totalsX, yPosition, { width: 70, align: 'right' })
    doc.text(formatCurrency(invoice.taxAmount), amountX, yPosition, { width: 70, align: 'right' })
    yPosition += 16
  }

  // Total - bold and larger
  doc.fontSize(12).font('Helvetica-Bold')
  doc.text('Total:', totalsX, yPosition, { width: 70, align: 'right' })
  doc.text(formatCurrency(invoice.totalAmount), amountX, yPosition, { width: 70, align: 'right' })
  yPosition += 25

  // --- NOTES SECTION ---
  if (invoice.notes) {
    // Separator line
    doc.strokeColor('#CCCCCC').lineWidth(1)
    doc.moveTo(50, yPosition).lineTo(545, yPosition).stroke()
    yPosition += 20

    // "Notes" label - bold
    doc.fontSize(11).font('Helvetica-Bold')
    doc.text('Notes:', 50, yPosition)
    yPosition += 16

    // Notes content - regular, slightly smaller
    doc.fontSize(9).font('Helvetica')
    doc.text(invoice.notes, 50, yPosition, { width: 495, lineGap: 3 })
    // Calculate height for multi-line notes
    const notesHeight = doc.heightOfString(invoice.notes, { width: 495, lineGap: 3 })
    yPosition += notesHeight + 20
  }

  // --- FOOTER ---
  // Write footer on the last page
  // Get final page count
  totalPageCount = doc.bufferedPageRange().count
  writeFooter(currentPageIndex, totalPageCount)
}

// Generate PDF as Buffer (reusable for email attachments)
export async function generateInvoicePDFBuffer(
  invoice: InvoiceWithRelations
): Promise<Buffer> {
  // Create PDF document
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
  })

  // Collect PDF chunks
  const chunks: Buffer[] = []
  doc.on('data', (chunk: Buffer) => chunks.push(chunk))

  // Generate PDF content
  generateInvoicePDF(doc, invoice)

  // End document
  doc.end()

  // Wait for PDF to finish generating
  await new Promise<void>((resolve) => {
    doc.on('end', () => resolve())
  })

  // Combine chunks into single buffer
  return Buffer.concat(chunks)
}


