'use client';

import { mainNavigation } from '@/lib/navigation';
import { NavLink } from './NavLink';
import { UserMenu } from './UserMenu';

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card hidden lg:block overflow-y-auto" aria-label="Main navigation">
      {/* Logo Section */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <div className="flex items-center gap-2">
          {/* Logo placeholder */}
          <div className="h-8 w-8 rounded bg-primary" aria-hidden="true" />
          <span className="text-xl font-bold text-foreground">Invoice</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto" aria-label="Main navigation">
        {mainNavigation.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* User Menu */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-card p-4">
        <UserMenu />
      </div>
    </aside>
  );
}

