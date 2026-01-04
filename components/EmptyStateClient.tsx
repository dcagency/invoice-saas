'use client'

import { useRouter } from 'next/navigation'
import EmptyState from './EmptyState'

export default function EmptyStateClient() {
  const router = useRouter()

  return (
    <EmptyState
      title="No clients yet"
      description="Add your first client to get started."
      actionLabel="Add your first client"
      onAction={() => {
        router.push('/clients/new')
      }}
    />
  )
}


