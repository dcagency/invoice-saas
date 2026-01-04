'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StatusBadge from './StatusBadge'
import DownloadPDFButton from './DownloadPDFButton'
import EmailInvoiceModal from './EmailInvoiceModal'
import SendInvoiceEmailModal from './SendInvoiceEmailModal'
import { ConfirmDialog } from './ConfirmDialog'
import { toast } from '@/lib/toast'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface InvoiceDetailViewProps {
  invoice: {
    id: string
    invoiceNumber: string
    issueDate: Date | string
    dueDate: Date | string
    status: 'DRAFT' | 'SENT' | 'PAID'
    subtotal: number | string
    taxRate: number | string | null
    taxAmount: number | string | null
    total: number | string
    notes: string | null
    client: {
      companyName: string
      contactName: string | null
      email: string | null
      streetAddress: string | null
      city: string | null
      state: string | null
      postalCode: string | null
      country: string | null
    }
    lineItems: Array<{
      description: string
      quantity: number | string
      unitPrice: number | string
      lineTotal: number | string
    }>
  }
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

export default function InvoiceDetailView({ invoice, companyProfile }: InvoiceDetailViewProps) {
  const router = useRouter()
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString()
  }

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return num.toFixed(2)
  }

  const isOverdue =
    invoice.status !== 'PAID' && new Date(invoice.dueDate) < new Date()

  const handleStatusChange = async (newStatus: 'DRAFT' | 'SENT' | 'PAID') => {
    setIsChangingStatus(true)
    try {
      const response = await fetch(`/api/invoices/${invoice.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        router.refresh()
        toast.success(`Invoice marked as ${newStatus}`, `Invoice ${invoice.invoiceNumber} status updated`)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status', error instanceof Error ? error.message : 'Please try again')
    } finally {
      setIsChangingStatus(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Invoice deleted successfully', `Invoice ${invoice.invoiceNumber} has been deleted`)
        router.push('/invoices')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete invoice')
      }
    } catch (error) {
      console.error('Error deleting invoice:', error)
      toast.error('Failed to delete invoice', error instanceof Error ? error.message : 'Please try again')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleDuplicate = async () => {
    setIsDuplicating(true)
    try {
      const response = await fetch(`/api/invoices/${invoice.id}/duplicate`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to duplicate invoice')
      }

      // Success
      toast.success('Invoice duplicated successfully', `New invoice ${data.invoiceNumber} created`)
      router.push(`/invoices/${data.invoiceId}`)
    } catch (error) {
      console.error('Error duplicating invoice:', error)
      toast.error('Failed to duplicate invoice', error instanceof Error ? error.message : 'Please try again')
    } finally {
      setIsDuplicating(false)
    }
  }

  return (
    <>
    <Card className="overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Invoice {invoice.invoiceNumber}</h2>
            <div className="mt-2 flex items-center gap-3">
              <StatusBadge status={invoice.status} />
              {isOverdue && (
                <Badge variant="overdue">OVERDUE</Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button asChild variant={invoice.status === 'DRAFT' ? 'default' : 'outline'}>
              <a href={`/invoices/${invoice.id}/edit`}>Edit</a>
            </Button>
            <Button
              onClick={handleDuplicate}
              disabled={isDuplicating}
              variant="outline"
            >
              {isDuplicating ? 'Duplicating...' : 'Duplicate Invoice'}
            </Button>
            <Select
              value={invoice.status}
              onChange={(e) => handleStatusChange(e.target.value as 'DRAFT' | 'SENT' | 'PAID')}
              disabled={isChangingStatus}
            >
              <option value="DRAFT">Mark as Draft</option>
              <option value="SENT">Mark as Sent</option>
              <option value="PAID">Mark as Paid</option>
            </Select>
            <Button
              onClick={() => setDeleteDialogOpen(true)}
              variant="destructive"
              aria-label="Delete invoice"
            >
              Delete
            </Button>
            <DownloadPDFButton
              invoiceId={invoice.id}
              invoiceNumber={invoice.invoiceNumber}
              variant="primary"
            />
            <Button
              onClick={() => setIsEmailModalOpen(true)}
              variant="outline"
            >
              Email Invoice
            </Button>
            <Button
              onClick={() => setIsSendEmailModalOpen(true)}
              variant="outline"
            >
              Send by Email
            </Button>
          </div>
        </div>

        {/* Company and Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">From</h3>
            {companyProfile ? (
              <div className="text-sm text-foreground">
                <p className="font-medium">{companyProfile.companyName}</p>
                {companyProfile.streetAddress && <p>{companyProfile.streetAddress}</p>}
                {(companyProfile.city || companyProfile.postalCode || companyProfile.country) && (
                  <p>
                    {[companyProfile.city, companyProfile.postalCode, companyProfile.country]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                )}
                {companyProfile.email && <p>{companyProfile.email}</p>}
                {companyProfile.phone && <p>{companyProfile.phone}</p>}
                {companyProfile.taxId && <p>Tax ID: {companyProfile.taxId}</p>}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Company profile not set</p>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Bill To</h3>
            <div className="text-sm text-foreground">
              <p className="font-medium">{invoice.client.companyName}</p>
              {invoice.client.contactName && <p>{invoice.client.contactName}</p>}
              {invoice.client.streetAddress && <p>{invoice.client.streetAddress}</p>}
              {(invoice.client.city || invoice.client.postalCode || invoice.client.country) && (
                <p>
                  {[invoice.client.city, invoice.client.postalCode, invoice.client.country]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              )}
              {invoice.client.email && <p>{invoice.client.email}</p>}
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Invoice Number:</span>
              <p className="font-medium text-foreground">{invoice.invoiceNumber}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Issue Date:</span>
              <p className="font-medium text-foreground">{formatDate(invoice.issueDate)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Due Date:</span>
              <p className="font-medium text-foreground">{formatDate(invoice.dueDate)}</p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.lineItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-foreground">{item.description}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {typeof item.quantity === 'string' ? item.quantity : item.quantity.toFixed(3)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatCurrency(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {formatCurrency(item.lineTotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-6">
          <div className="w-full max-w-xs">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium text-foreground">{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.taxRate && parseFloat(invoice.taxRate.toString()) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({invoice.taxRate}%):</span>
                  <span className="font-medium text-foreground">{formatCurrency(invoice.taxAmount || 0)}</span>
                </div>
              )}
              <div className="border-t border-border pt-2">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-foreground">Total:</span>
                  <span className="text-lg font-bold text-foreground">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-medium text-foreground mb-2">Notes</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}
      </div>
    </Card>

      <EmailInvoiceModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        invoice={{
          invoiceNumber: invoice.invoiceNumber,
          issueDate: invoice.issueDate,
          dueDate: invoice.dueDate,
          total: invoice.total,
          client: invoice.client,
        }}
        companyProfile={companyProfile}
      />

      <SendInvoiceEmailModal
        isOpen={isSendEmailModalOpen}
        onClose={() => setIsSendEmailModalOpen(false)}
        invoice={{
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          issueDate: invoice.issueDate,
          dueDate: invoice.dueDate,
          total: invoice.total,
          client: invoice.client,
        }}
        defaultEmail={invoice.client?.email || ''}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Invoice"
        description={`Are you sure you want to delete invoice ${invoice.invoiceNumber}? This action cannot be undone.`}
        confirmText="Delete Invoice"
        variant="danger"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </>
  )
}

