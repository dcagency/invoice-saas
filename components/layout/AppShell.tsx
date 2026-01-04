import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Sidebar (desktop) */}
      <Sidebar />

      {/* Topbar */}
      <Topbar />

      {/* Main content area */}
      {children}
    </div>
  );
}

