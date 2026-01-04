import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PageContainerProps = {
  children: ReactNode;
  maxWidth?: 'max-w-3xl' | 'max-w-4xl' | 'max-w-5xl' | 'max-w-7xl' | 'full';
  className?: string;
};

export function PageContainer({
  children,
  maxWidth = 'max-w-7xl',
  className,
}: PageContainerProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Spacer for topbar */}
      <div className="h-16" />

      {/* Content */}
      <main className="ml-0 lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className={cn(maxWidth === 'full' ? 'w-full' : maxWidth, 'mx-auto', className)}>
          {children}
        </div>
      </main>
    </div>
  );
}

