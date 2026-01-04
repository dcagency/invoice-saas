'use client';

import { Menu, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { MobileNav } from './MobileNav';
import { usePathname } from 'next/navigation';

export function Topbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Simple breadcrumb logic
  const getBreadcrumb = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname.startsWith('/invoices')) {
      if (pathname === '/invoices') return 'Invoices';
      if (pathname === '/invoices/new') return 'Invoices > New';
      if (pathname.includes('/invoices/') && pathname.includes('/edit')) return 'Invoices > Edit';
      if (pathname.includes('/invoices/')) return 'Invoices > Detail';
      return 'Invoices';
    }
    if (pathname.startsWith('/clients')) {
      if (pathname === '/clients') return 'Clients';
      if (pathname === '/clients/new') return 'Clients > New';
      if (pathname.includes('/clients/') && pathname.includes('/edit')) return 'Clients > Edit';
      return 'Clients';
    }
    if (pathname.startsWith('/company')) {
      if (pathname === '/company/edit') return 'Company';
      if (pathname === '/company/setup') return 'Company > Setup';
      return 'Company';
    }
    return 'Dashboard';
  };

  return (
    <>
      <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 h-16 border-b border-border bg-background">
        <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left side */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>

            {/* Breadcrumbs (desktop only) */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-foreground font-medium">{getBreadcrumb()}</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search button (placeholder) */}
            <Button variant="ghost" size="icon" title="Search (coming soon)" aria-label="Search">
              <Search className="h-5 w-5" aria-hidden="true" />
            </Button>

            {/* Theme toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Mobile navigation overlay */}
      <MobileNav open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}

