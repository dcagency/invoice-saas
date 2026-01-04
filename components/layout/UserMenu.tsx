'use client';

import { User, Settings, LogOut } from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function UserMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut();
  };

  const userInitials = user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress?.[0] || 'U';
  const userName = user?.firstName || user?.emailAddresses[0]?.emailAddress || 'User';
  const userEmail = user?.emailAddresses[0]?.emailAddress || 'user@example.com';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2 px-2" aria-label="User menu">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-medium" aria-hidden="true">
            {userInitials.toUpperCase()}
          </div>
          <div className="flex flex-col items-start text-left flex-1 min-w-0">
            <span className="text-sm font-medium text-foreground truncate w-full">{userName}</span>
            <span className="text-xs text-muted-foreground truncate w-full">{userEmail}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem aria-label="Settings">
          <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} aria-label="Sign out">
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

