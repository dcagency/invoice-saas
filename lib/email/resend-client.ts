import { Resend } from 'resend'

export interface SendInvoiceEmailParams {
  to: string
  subject: string
  textBody: string
  pdfBuffer: Buffer
  pdfFilename: string
}

/**
 * Get Resend client instance, or null if API key is not configured.
 * Does not throw at top-level to prevent build/import crashes.
 */
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return null
  }
  return new Resend(apiKey)
}

/**
 * Get the from email address from environment or use default.
 * Resend requires verified domains, so Gmail addresses are not allowed.
 * For development, we use onboarding@resend.dev which works without verification.
 */
function getFromEmail(): string {
  const fromEmail = process.env.RESEND_FROM_EMAIL
  
  if (!fromEmail) {
    return 'Invoice SaaS <onboarding@resend.dev>'
  }
  
  // Check if the email contains gmail.com or other unverified domains
  // Resend doesn't allow sending from Gmail without domain verification
  // For development, use onboarding@resend.dev which works without verification
  const emailLower = fromEmail.toLowerCase()
  if (emailLower.includes('@gmail.com') || emailLower.includes('@yahoo.com') || emailLower.includes('@hotmail.com') || emailLower.includes('@outlook.com')) {
    // Extract name if provided in format "Name <email>", otherwise use default
    const nameMatch = fromEmail.match(/^(.+?)\s*<.+>$/i)
    const senderName = nameMatch ? nameMatch[1].trim() : 'Invoice SaaS'
    return `${senderName} <onboarding@resend.dev>`
  }
  
  // If it's already in the correct format, use it as-is
  // Otherwise, wrap it in a friendly format
  if (fromEmail.includes('<') && fromEmail.includes('>')) {
    return fromEmail
  }
  
  return `Invoice SaaS <${fromEmail}>`
}

export async function sendInvoiceEmail(params: SendInvoiceEmailParams) {
  const resend = getResendClient()
  if (!resend) {
    throw new Error('RESEND_API_KEY is not defined in environment variables')
  }

  const { to, subject, textBody, pdfBuffer, pdfFilename } = params

  const { data, error } = await resend.emails.send({
    from: getFromEmail(),
    to: [to],
    subject,
    text: textBody,
    attachments: [
      {
        filename: pdfFilename,
        content: pdfBuffer,
      },
    ],
  })

  if (error) {
    throw new Error(`Resend API error: ${error.message}`)
  }

  return data
}

