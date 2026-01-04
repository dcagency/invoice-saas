'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: 'bg-card border border-border text-foreground shadow-lg',
          title: 'text-foreground font-medium',
          description: 'text-muted-foreground text-sm',
          actionButton: 'bg-primary text-white hover:bg-primary-hover',
          cancelButton: 'bg-muted text-muted-foreground hover:bg-muted/80',
          error: 'bg-error text-white border-error',
          success: 'bg-success text-white border-success',
          warning: 'bg-warning text-white border-warning',
          info: 'bg-info text-white border-info',
        },
      }}
    />
  );
}

