'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import InvoicesTable from './InvoicesTable'
import DeleteInvoiceModal from './DeleteInvoiceModal'
import EmptyState from './EmptyState'
import { toast } from '@/lib/toast'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Invoice {
  id: string
  invoiceNumber: string
  issueDate: string
  dueDate: string
  total: number | string
  status: 'DRAFT' | 'SENT' | 'PAID'
  client: {
    id: string
    companyName: string
  }
}

interface InvoicesPageClientProps {
  initialInvoices: Invoice[]
}

export default function InvoicesPageClient({ initialInvoices }: InvoicesPageClientProps) {
  const router = useRouter()
  const [invoices, setInvoices] = useState(initialInvoices)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedClientId, setSelectedClientId] = useState<string>('all')
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    invoiceId: string | null
    invoiceNumber: string
  }>({
    isOpen: false,
    invoiceId: null,
    invoiceNumber: '',
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Extract unique clients from invoices
  const uniqueClients = useMemo(() => {
    const clientMap = new Map<string, { id: string; name: string }>()
    invoices.forEach((inv) => {
      if (inv.client?.id && inv.client?.companyName) {
        if (!clientMap.has(inv.client.id)) {
          clientMap.set(inv.client.id, {
            id: inv.client.id,
            name: inv.client.companyName,
          })
        }
      }
    })
    return Array.from(clientMap.values())
  }, [invoices])

  // Filter invoices based on search, client, and status
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      // Search filter
      const matchesSearch =
        searchTerm === '' ||
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())

      // Client filter
      const matchesClient =
        selectedClientId === 'all' || invoice.client?.id === selectedClientId

      // Status filter
      const matchesStatus =
        statusFilter === 'ALL' || invoice.status === statusFilter

      return matchesSearch && matchesClient && matchesStatus
    })
  }, [invoices, searchTerm, selectedClientId, statusFilter])

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedClientId('all')
  }

  const handleView = (invoiceId: string) => {
    router.push(`/invoices/${invoiceId}`)
  }

  const handleEdit = (invoiceId: string) => {
    router.push(`/invoices/${invoiceId}/edit`)
  }

  const handleDeleteClick = (invoiceId: string, invoiceNumber: string) => {
    setDeleteModal({
      isOpen: true,
      invoiceId,
      invoiceNumber,
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.invoiceId) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/invoices/${deleteModal.invoiceId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete invoice')
      }

      setInvoices(invoices.filter((inv) => inv.id !== deleteModal.invoiceId))
      setDeleteModal({ isOpen: false, invoiceId: null, invoiceNumber: '' })
      toast.success('Invoice deleted successfully', `Invoice ${deleteModal.invoiceNumber} has been deleted`)
    } catch (error) {
      console.error('Error deleting invoice:', error)
      toast.error('Failed to delete invoice', error instanceof Error ? error.message : 'Please try again')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, invoiceId: null, invoiceNumber: '' })
  }

  const handleMarkAsPaid = async (invoiceId: string) => {
    setUpdatingId(invoiceId)
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PAID' }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      // Update local state optimistically
      const updatedInvoice = invoices.find((inv) => inv.id === invoiceId)
      setInvoices(
        invoices.map((inv) => (inv.id === invoiceId ? { ...inv, status: 'PAID' } : inv))
      )
      toast.success('Invoice marked as Paid', updatedInvoice ? `Invoice ${updatedInvoice.invoiceNumber} is now paid` : undefined)
    } catch (error) {
      console.error('Error updating invoice status:', error)
      toast.error('Failed to update status', error instanceof Error ? error.message : 'Please try again')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <>
      {/* Search and Filters */}
      <div className="mb-4 space-y-3 md:space-y-0 md:flex md:gap-3">
        {/* Search Input */}
        <div className="flex-1">
          <label htmlFor="invoice-search" className="sr-only">
            Search by invoice number
          </label>
          <Input
            id="invoice-search"
            type="text"
            placeholder="Search by invoice number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Client Filter */}
        <div className="flex-1 md:flex-initial">
          <label htmlFor="client-filter" className="sr-only">
            Filter by client
          </label>
          <Select
            id="client-filter"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
          >
            <option value="all">All Clients</option>
            {uniqueClients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Status Filter */}
        <div className="flex-1 md:flex-initial">
          <label htmlFor="status-filter" className="sr-only">
            Filter by status
          </label>
          <Select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="PAID">Paid</option>
          </Select>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <Card>
          <div className="px-4 py-5 sm:p-6">
            {invoices.length === 0 ? (
              <EmptyState
                title="No invoices yet"
                description="Create your first invoice to get started."
                actionLabel="Create your first invoice"
                onAction={() => router.push('/invoices/new')}
              />
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  No invoices found matching your filters
                </p>
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="px-4 py-5 sm:p-6">
            <InvoicesTable
              invoices={filteredInvoices}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onMarkAsPaid={handleMarkAsPaid}
              updatingId={updatingId}
            />
          </div>
        </Card>
      )}

      <DeleteInvoiceModal
        isOpen={deleteModal.isOpen}
        invoiceNumber={deleteModal.invoiceNumber}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={isDeleting}
      />
    </>
  )
}

