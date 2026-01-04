'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DropdownMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | undefined>(undefined)

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ 
  asChild, 
  children 
}: { 
  asChild?: boolean
  children: React.ReactNode 
}) {
  const context = React.useContext(DropdownMenuContext)
  if (!context) throw new Error('DropdownMenuTrigger must be used within DropdownMenu')

  const handleClick = () => {
    context.setOpen(!context.open)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: handleClick } as any)
  }

  return (
    <button onClick={handleClick} type="button">
      {children}
    </button>
  )
}

export function DropdownMenuContent({ 
  align = 'start',
  children,
  className 
}: { 
  align?: 'start' | 'end'
  children: React.ReactNode
  className?: string
}) {
  const context = React.useContext(DropdownMenuContext)
  if (!context) throw new Error('DropdownMenuContent must be used within DropdownMenu')

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-dropdown-menu]')) {
        context.setOpen(false)
      }
    }

    if (context.open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [context.open, context])

  if (!context.open) return null

  return (
    <div
      data-dropdown-menu
      className={cn(
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-card p-1 shadow-lg',
        align === 'end' ? 'right-0' : 'left-0',
        'mt-2',
        className
      )}
    >
      {children}
    </div>
  )
}

export function DropdownMenuLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 py-1.5 text-sm font-semibold text-foreground">
      {children}
    </div>
  )
}

export function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-border" />
}

export function DropdownMenuItem({ 
  children,
  onClick,
  className 
}: { 
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  const context = React.useContext(DropdownMenuContext)
  
  const handleClick = () => {
    onClick?.()
    context?.setOpen(false)
  }

  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-muted focus:bg-muted',
        className
      )}
      onClick={handleClick}
    >
      {children}
    </div>
  )
}

