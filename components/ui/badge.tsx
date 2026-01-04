import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'draft' | 'sent' | 'paid' | 'overdue' | 'success' | 'warning' | 'error' | 'info'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-muted text-muted-foreground',
      draft: 'bg-status-draft-bg text-status-draft border border-status-draft/20',
      sent: 'bg-status-sent-bg text-status-sent border border-status-sent/20',
      paid: 'bg-status-paid-bg text-status-paid border border-status-paid/20',
      overdue: 'bg-status-overdue-bg text-status-overdue border border-status-overdue/20',
      success: 'bg-success-bg text-success border border-success/20',
      warning: 'bg-warning-bg text-warning border border-warning/20',
      error: 'bg-error-bg text-error border border-error/20',
      info: 'bg-info-bg text-info border border-info/20',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'

export { Badge }

