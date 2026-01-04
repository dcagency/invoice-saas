type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID'

interface StatusBadgeProps {
  status: InvoiceStatus
  size?: 'sm' | 'md' | 'lg'
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  const statusClasses = {
    DRAFT: 'bg-status-draft-bg text-status-draft border border-status-draft/20',
    SENT: 'bg-status-sent-bg text-status-sent border border-status-sent/20',
    PAID: 'bg-status-paid-bg text-status-paid border border-status-paid/20',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${sizeClasses[size]} ${statusClasses[status]}`}
    >
      {status}
    </span>
  )
}


