'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ClientsTable from './ClientsTable'
import DeleteClientModal from './DeleteClientModal'
import { toast } from '@/lib/toast'

interface Client {
  id: string
  companyName: string
  contactName: string | null
  email: string | null
  city: string | null
}

interface ClientsPageClientProps {
  clients: Client[]
}

export default function ClientsPageClient({ clients: initialClients }: ClientsPageClientProps) {
  const router = useRouter()
  const [clients, setClients] = useState(initialClients)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    clientId: string | null
    clientName: string
  }>({
    isOpen: false,
    clientId: null,
    clientName: '',
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (clientId: string) => {
    router.push(`/clients/${clientId}/edit`)
  }

  const handleDeleteClick = (clientId: string, clientName: string) => {
    setDeleteModal({
      isOpen: true,
      clientId,
      clientName,
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.clientId) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/clients/${deleteModal.clientId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete client')
      }

      // Remove client from list
      setClients(clients.filter((c) => c.id !== deleteModal.clientId))
      setDeleteModal({ isOpen: false, clientId: null, clientName: '' })
      
      toast.success('Client deleted successfully', `Client ${deleteModal.clientName} has been deleted`)
    } catch (error) {
      console.error('Error deleting client:', error)
      const errorData = error instanceof Error ? error.message : 'Failed to delete client'
      toast.error('Failed to delete client', errorData)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, clientId: null, clientName: '' })
  }

  return (
    <>
      <ClientsTable
        clients={clients}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
      <DeleteClientModal
        isOpen={deleteModal.isOpen}
        clientName={deleteModal.clientName}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={isDeleting}
      />
    </>
  )
}


