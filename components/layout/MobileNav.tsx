'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { mainNavigation } from '@/lib/navigation';
import { NavLink } from './NavLink';
import { UserMenu } from './UserMenu';
import { Button } from '@/components/ui/button';

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-card lg:hidden" aria-label="Mobile navigation">
        {/* Header with close button */}
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-primary" aria-hidden="true" />
            <span className="text-xl font-bold text-foreground">Invoice</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close navigation menu">
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto" aria-label="Main navigation">
          {mainNavigation.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        {/* User menu */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-card p-4">
          <UserMenu />
        </div>
      </aside>
    </>
  );
}

