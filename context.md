# Invoice SaaS - Context: Micro-UX Polish (Toasts, Loading, Empty States, Badges, Accessibility)

## 1. Goal

Apply comprehensive micro-UX polish across the entire application following DESIGN_BLUEPRINT.md specifications, focusing on feedback mechanisms (toasts, loading states), graceful degradation (empty states, error states), visual clarity (status badges, icons), and accessibility improvements (focus states, ARIA labels, keyboard navigation), transforming the app into a premium, production-ready product.

**Deliverables:**
- Toast notification system for all user actions (success, error, info, warning)
- Consistent loading states (skeletons, spinners, disabled states)
- Comprehensive empty states for all lists/collections
- Polished status badges with semantic colors
- Focus-visible styles for all interactive elements
- ARIA labels and screen reader support
- Keyboard shortcuts for common actions
- Error boundaries and graceful error handling
- Confirmation dialogs for destructive actions
- Visual feedback on all interactions (hover, active, disabled)

## 2. Non-goals (Hard Constraints)

**DO NOT:**
- Change Prisma schema or database migrations
- Modify API routes logic, endpoints, or request/response formats
- Alter business logic (calculations, validations, invoice processing)
- Change TypeScript types or interfaces (unless strictly for UI props)
- Refactor state management or data fetching patterns
- Add new backend features or API endpoints
- Implement real-time features (WebSockets, polling)
- Add analytics or tracking systems
- Implement internationalization (i18n)
- Add new major dependencies (use existing or minimal additions)

**MINIMAL CHANGES ONLY:**
- Add toast notifications to existing actions
- Replace loading states with skeletons
- Add empty states where missing
- Apply consistent badge styling
- Add ARIA attributes to existing elements
- Add focus-visible styles
- Add confirmation dialogs
- Improve error handling UI

## 3. Files in Scope

### Files to CREATE

```
components/ui/toast.tsx                         (NEW - shadcn toast if not exists)
components/ui/toast-provider.tsx                (NEW - Toast context provider)
components/feedback/ConfirmDialog.tsx           (NEW - Reusable confirmation modal)
components/feedback/ErrorBoundary.tsx           (NEW - Error boundary wrapper)
components/feedback/LoadingButton.tsx           (NEW - Button with loading state)
components/feedback/LoadingSkeleton.tsx         (NEW - Page-level skeleton)
lib/toast.ts                                    (NEW - Toast utility functions)
lib/keyboard-shortcuts.ts                       (NEW - Keyboard shortcut manager)
styles/focus-visible.css                        (NEW - Focus styles if needed)
```

### Files to MODIFY

```
// Root layout (add toast provider)
app/layout.tsx                                  (MODIFY - Wrap with ToastProvider)

// Pages - add toasts, empty states, loading
app/dashboard/page.tsx                          (MODIFY - Add loading, empty states)
app/invoices/page.tsx                           (MODIFY - Add toasts, confirmations)
app/invoices/[id]/page.tsx                      (MODIFY - Add toasts, loading)
app/invoices/new/page.tsx                       (MODIFY - Add toasts, validation)
app/invoices/[id]/edit/page.tsx                 (MODIFY - Add toasts, validation)
app/clients/page.tsx                            (MODIFY - Add toasts, confirmations)
app/clients/[id]/edit/page.tsx                  (MODIFY - Add toasts)
app/company/edit/page.tsx                       (MODIFY - Add toasts)

// API route wrappers (add error handling)
app/api/invoices/[id]/route.ts                  (MODIFY - Improve error responses)
app/api/clients/[id]/route.ts                   (MODIFY - Improve error responses)

// Components - add accessibility
components/layout/Sidebar.tsx                   (MODIFY - Add ARIA labels)
components/layout/Topbar.tsx                    (MODIFY - Add ARIA labels)
components/layout/NavLink.tsx                   (MODIFY - Add ARIA current)
components/theme/ThemeToggle.tsx                (MODIFY - Add ARIA label)
components/tables/InvoicesTable.tsx             (MODIFY - Add ARIA labels if exists)
components/forms/InvoiceForm.tsx                (MODIFY - Add ARIA labels if exists)

// UI components - improve states
components/ui/button.tsx                        (MODIFY - Add loading state)
components/ui/input.tsx                         (MODIFY - Add ARIA invalid)
components/ui/select.tsx                        (MODIFY - Add ARIA invalid)
components/ui/badge.tsx                         (MODIFY - Ensure semantic colors)

// Global styles
app/globals.css                                 (MODIFY - Add focus-visible styles)
```

### Files to VERIFY (check if exist, report structure)

```
// Check toast library
components/ui/toast.tsx                         (VERIFY - shadcn toast exists?)
package.json                                    (VERIFY - sonner? react-hot-toast?)

// Check existing components
components/ui/dialog.tsx                        (VERIFY - for confirmation dialog)
components/ui/alert-dialog.tsx                  (VERIFY - shadcn alert dialog?)

// Check error handling
lib/error-handler.ts                            (VERIFY - existing error utils?)
middleware.ts                                   (VERIFY - error middleware?)
```

**STOP CONDITIONS:**
1. If toast library choice is unclear (multiple installed, conflicting)
2. If more than 30 files need modification (scope too large - report)
3. If accessibility requirements conflict with existing patterns (report)
4. If error handling is deeply coupled to business logic (can't separate)

## 4. Implementation Plan (Steps)

### Phase 1: Toast Notification System

**Step 1.1: Setup Toast Library**
- [ ] Check if toast library exists (shadcn toast, sonner, react-hot-toast)
- [ ] If none: install `sonner` (recommended: simple, accessible, beautiful)
  ```bash
  npm install sonner
  ```
- [ ] If shadcn toast exists: use it
- [ ] Create toast provider wrapper

**Step 1.2: Create Toast Provider**
- [ ] Create `components/ui/toast-provider.tsx`
- [ ] Wrap app in root layout
- [ ] Position: top-right on desktop, top-center on mobile
- [ ] Max 3 toasts visible (stack or queue)
- [ ] Auto-dismiss after duration (3-5 seconds)

**Toast Provider (using Sonner):**
```tsx
'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: 'bg-card border-border text-foreground',
          title: 'text-foreground',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-white',
          cancelButton: 'bg-muted text-muted-foreground',
          error: 'bg-error text-white',
          success: 'bg-success text-white',
          warning: 'bg-warning text-white',
          info: 'bg-info text-white',
        },
      }}
    />
  );
}
```

**Step 1.3: Create Toast Utility**
- [ ] Create `lib/toast.ts`
- [ ] Export typed toast functions (success, error, warning, info)
- [ ] Standardize message formats
- [ ] Add action buttons where appropriate

**Toast Utility:**
```typescript
import { toast as sonnerToast } from 'sonner';

export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, { description });
  },
  
  error: (message: string, description?: string) => {
    sonnerToast.error(message, { description });
  },
  
  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, { description });
  },
  
  info: (message: string, description?: string) => {
    sonnerToast.info(message, { description });
  },
  
  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, { loading, success, error });
  },
};
```

**Step 1.4: Add Toasts to All Actions**
- [ ] **Invoice Create:** Success toast on create, error on failure
- [ ] **Invoice Edit:** Success toast on save, error on failure
- [ ] **Invoice Delete:** Confirmation dialog → success/error toast
- [ ] **Invoice Duplicate:** Success toast with link to new invoice
- [ ] **Invoice Email:** Success toast, error with helpful message
- [ ] **Invoice PDF:** Success toast (or download starts), error toast
- [ ] **Invoice Status Change:** Success toast ("Invoice marked as Paid")
- [ ] **Client Create:** Success toast
- [ ] **Client Edit:** Success toast
- [ ] **Client Delete:** Confirmation → success/error toast
- [ ] **Company Profile:** Success toast on save

**Example Integration:**
```tsx
// In invoice create page
const handleSubmit = async (data: InvoiceFormData) => {
  try {
    const response = await fetch('/api/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      toast.error('Failed to create invoice', error.message || 'Please try again');
      return;
    }
    
    const invoice = await response.json();
    toast.success('Invoice created successfully', `Invoice ${invoice.invoiceNumber} is ready`);
    router.push(`/invoices/${invoice.id}`);
  } catch (error) {
    toast.error('Failed to create invoice', 'An unexpected error occurred');
  }
};
```

### Phase 2: Loading States

**Step 2.1: Create LoadingButton Component**
- [ ] Create `components/feedback/LoadingButton.tsx`
- [ ] Extend Button component with loading prop
- [ ] Show spinner icon when loading
- [ ] Disable button when loading
- [ ] Replace button text with "Loading..." or keep original with spinner

**LoadingButton:**
```tsx
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export function LoadingButton({
  loading,
  loadingText,
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={disabled || loading}
      className={cn(className)}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? loadingText || children : children}
    </Button>
  );
}
```

**Step 2.2: Add Loading States to Forms**
- [ ] Replace all submit buttons with LoadingButton
- [ ] Disable form inputs when submitting (add disabled={loading} to inputs)
- [ ] Show loading indicator on async operations
- [ ] Prevent double-submit (button disabled during first submit)

**Step 2.3: Add Page-Level Loading Skeletons**
- [ ] Create `components/feedback/LoadingSkeleton.tsx` variants:
  - InvoiceListSkeleton
  - InvoiceDetailSkeleton
  - FormSkeleton
  - DashboardSkeleton
- [ ] Use Suspense boundaries where possible (Next.js 14)
- [ ] Show skeleton while data fetching

**Example Skeleton:**
```tsx
export function InvoiceDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-start">
        <div>
          <div className="h-8 w-32 bg-muted rounded mb-2" />
          <div className="h-4 w-48 bg-muted rounded" />
        </div>
        <div className="h-6 w-20 bg-muted rounded" />
      </div>
      
      {/* Card skeleton */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="space-y-3">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
          <div className="h-4 w-1/2 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
```

**Step 2.4: Add Inline Loading Indicators**
- [ ] Add spinner to async dropdown actions (e.g., "Marking as paid...")
- [ ] Add loading state to PDF download button
- [ ] Add loading state to email send button
- [ ] Show progress for multi-step operations (optional)

### Phase 3: Empty States

**Step 3.1: Audit All Collections**
- [ ] List all pages with collections/lists:
  - Dashboard (KPI cards, recent invoices)
  - Invoices list
  - Clients list
  - Invoice line items (should always have 1+, but handle gracefully)
  - Search results (no matches)

**Step 3.2: Create Comprehensive Empty States**
- [ ] Empty states already created in previous slices (verify)
- [ ] Ensure all have:
  - Relevant icon (FileText, Users, Search)
  - Clear title ("No invoices yet")
  - Helpful description
  - Primary action button (when appropriate)
  - Optional secondary action or help link

**Step 3.3: Add Search/Filter Empty States**
- [ ] "No results found" for search with no matches
- [ ] Different message from "no data at all"
- [ ] Include "Clear filters" button
- [ ] Show current filters/search term in message

**Empty State for Search:**
```tsx
{filteredInvoices.length === 0 && searchTerm && (
  <EmptyState
    icon={Search}
    title="No invoices found"
    description={`No invoices match "${searchTerm}". Try a different search term or clear filters.`}
    action={{
      label: 'Clear Search',
      onClick: () => setSearchTerm(''),
    }}
  />
)}
```

**Step 3.4: Add Error States**
- [ ] Different from empty states (data failed to load vs no data)
- [ ] Include retry button
- [ ] Helpful error message (not technical error details)
- [ ] Log full error to console for debugging

**Error State:**
```tsx
{error && (
  <div className="rounded-lg border border-error bg-error/10 p-6 text-center">
    <AlertCircle className="h-12 w-12 text-error mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-foreground mb-2">
      Failed to load invoices
    </h3>
    <p className="text-sm text-muted-foreground mb-4">
      We couldn't load your invoices. Please try again.
    </p>
    <Button onClick={retry} variant="outline">
      Retry
    </Button>
  </div>
)}
```

### Phase 4: Confirmation Dialogs

**Step 4.1: Create ConfirmDialog Component**
- [ ] Create `components/feedback/ConfirmDialog.tsx`
- [ ] Use shadcn AlertDialog if available, or Dialog
- [ ] Accept props: open, onOpenChange, title, description, confirmText, onConfirm, variant (danger/default)
- [ ] Destructive variant: red confirm button
- [ ] Focus confirm button by default (or cancel for destructive)

**ConfirmDialog:**
```tsx
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  variant?: 'default' | 'danger';
  loading?: boolean;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'default',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              variant === 'danger' && 'bg-error hover:bg-error/90'
            )}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

**Step 4.2: Add Confirmations to Destructive Actions**
- [ ] Invoice delete: Confirm before delete
- [ ] Client delete: Confirm, show warning if has invoices
- [ ] Bulk actions (if implemented): Confirm before bulk delete
- [ ] Unsaved changes: Warn before navigating away (optional, complex)

**Example Usage:**
```tsx
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [deleting, setDeleting] = useState(false);

const handleDelete = async () => {
  setDeleting(true);
  try {
    await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
    toast.success('Invoice deleted');
    router.push('/invoices');
  } catch {
    toast.error('Failed to delete invoice');
  } finally {
    setDeleting(false);
    setDeleteDialogOpen(false);
  }
};

// In JSX
<Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
  Delete
</Button>

<ConfirmDialog
  open={deleteDialogOpen}
  onOpenChange={setDeleteDialogOpen}
  title="Delete Invoice"
  description="Are you sure? This action cannot be undone."
  confirmText="Delete Invoice"
  variant="danger"
  onConfirm={handleDelete}
  loading={deleting}
/>
```

### Phase 5: Accessibility Improvements

**Step 5.1: Add Focus-Visible Styles**
- [ ] Add global focus-visible styles to `globals.css`
- [ ] Remove default outline, add custom ring
- [ ] Ensure focus ring visible in light and dark mode
- [ ] Don't show focus ring on mouse click (only keyboard)

**Focus Styles (globals.css):**
```css
@layer base {
  /* Focus-visible for keyboard navigation */
  *:focus-visible {
    outline: 2px solid hsl(var(--color-ring));
    outline-offset: 2px;
  }

  /* Remove focus outline on mouse click */
  *:focus:not(:focus-visible) {
    outline: none;
  }

  /* Custom focus ring for specific elements */
  button:focus-visible,
  a:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    @apply ring-2 ring-primary ring-offset-2 ring-offset-background;
  }
}
```

**Step 5.2: Add ARIA Labels**
- [ ] All icon-only buttons have aria-label
- [ ] Navigation has aria-current for active page
- [ ] Form inputs have associated labels (visible or sr-only)
- [ ] Error messages have aria-describedby on inputs
- [ ] Modal dialogs have aria-labelledby and aria-describedby
- [ ] Search inputs have role="search"
- [ ] Status badges have aria-label if icon-only

**ARIA Examples:**
```tsx
// Icon button
<Button variant="ghost" size="icon" aria-label="Delete invoice">
  <Trash2 className="h-4 w-4" />
</Button>

// Navigation link
<NavLink href="/invoices" aria-current={isActive ? 'page' : undefined}>
  Invoices
</NavLink>

// Input with error
<input
  id="email"
  aria-invalid={!!error}
  aria-describedby={error ? 'email-error' : undefined}
/>
{error && <p id="email-error" className="text-xs text-error">{error}</p>}

// Modal
<Dialog>
  <DialogContent aria-labelledby="dialog-title" aria-describedby="dialog-description">
    <DialogTitle id="dialog-title">Delete Invoice</DialogTitle>
    <DialogDescription id="dialog-description">
      This action cannot be undone.
    </DialogDescription>
  </DialogContent>
</Dialog>
```

**Step 5.3: Improve Keyboard Navigation**
- [ ] Tab order follows visual order
- [ ] Escape closes modals and dropdowns
- [ ] Enter/Space activates buttons
- [ ] Arrow keys navigate within menus
- [ ] Trap focus in modals (focus stays inside until closed)
- [ ] Focus first element in modal on open
- [ ] Return focus to trigger element on modal close

**Step 5.4: Add Skip Links (Optional)**
- [ ] Add "Skip to main content" link at very top (hidden, visible on focus)
- [ ] Allows keyboard users to skip navigation
- [ ] Focus goes directly to main content area

**Skip Link:**
```tsx
// In app/layout.tsx or Topbar

  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
             focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 
             focus:rounded-md"
>
  Skip to main content
</a>

// In page content
<main id="main-content" tabIndex={-1}>
  {/* Page content */}
</main>
```

**Step 5.5: Screen Reader Improvements**
- [ ] Loading states announced (aria-live="polite")
- [ ] Success/error toasts announced
- [ ] Form validation errors announced
- [ ] Dynamic content changes announced
- [ ] Visually hidden text for context (sr-only class)

**Screen Reader Examples:**
```tsx
// Loading announcement
{loading && (
  <span className="sr-only" aria-live="polite">
    Loading invoices...
  </span>
)}

// Status change
<span className="sr-only" aria-live="polite" aria-atomic="true">
  Invoice status changed to {status}
</span>

// Icon with context
<button>
  <Trash2 className="h-4 w-4" />
  <span className="sr-only">Delete invoice</span>
</button>
```

### Phase 6: Error Boundaries

**Step 6.1: Create Error Boundary**
- [ ] Create `components/feedback/ErrorBoundary.tsx`
- [ ] Catch React errors (component crashes)
- [ ] Show user-friendly error UI
- [ ] Log error to console (and to error tracking service if available)
- [ ] Provide "Try Again" button (resets error boundary)

**ErrorBoundary:**
```tsx
'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error boundary caught:', error, errorInfo);
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
          <AlertTriangle className="h-12 w-12 text-error mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Something went wrong
          </h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <Button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Step 6.2: Wrap Critical Sections**
- [ ] Wrap each page in ErrorBoundary (or wrap in layout)
- [ ] Wrap complex components (charts, forms)
- [ ] Consider granular error boundaries (one per section)
- [ ] Ensure errors don't crash entire app

### Phase 7: Visual Feedback Polish

**Step 7.1: Add Hover States (if missing)**
- [ ] All buttons have hover effect (background change)
- [ ] All links have hover effect (underline or color change)
- [ ] Table rows have hover effect (background change)
- [ ] Cards have hover effect (shadow or border change)
- [ ] Dropdowns have hover effect

**Step 7.2: Add Active States**
- [ ] Buttons have active state (pressed appearance)
- [ ] Links have active state
- [ ] Form inputs have focus state (ring/border)

**Step 7.3: Add Disabled States**
- [ ] Disabled buttons have reduced opacity (0.5)
- [ ] Disabled buttons have cursor-not-allowed
- [ ] Disabled inputs have reduced opacity
- [ ] Disabled elements don't respond to interactions

**Step 7.4: Add Transitions**
- [ ] All state changes have smooth transitions (200ms)
- [ ] Background color transitions
- [ ] Border color transitions
- [ ] Opacity transitions
- [ ] No transitions for transform/layout (performance)

**Transition Classes:**
```css
.transition-smooth {
  transition: background-color 200ms, border-color 200ms, color 200ms, opacity 200ms;
}
```

**Step 7.5: Add Micro-Animations (Subtle)**
- [ ] Modal fade-in (opacity + scale)
- [ ] Toast slide-in from top
- [ ] Dropdown slide-down
- [ ] Loading spinner rotate
- [ ] Success checkmark animate (optional, if time allows)

### Phase 8: Keyboard Shortcuts (Optional)

**Step 8.1: Define Shortcuts**
- [ ] Common actions:
  - `n`: New invoice (from invoices list)
  - `Cmd+K` or `Ctrl+K`: Focus search (global)
  - `Escape`: Close modal/dropdown
  - `/`: Focus search (alternative)
  - `?`: Show keyboard shortcuts help (optional)

**Step 8.2: Implement Shortcut Manager**
- [ ] Create `lib/keyboard-shortcuts.ts`
- [ ] Hook: `useKeyboardShortcut(key, callback, enabled?)`
- [ ] Prevent default browser behavior
- [ ] Don't trigger when typing in input/textarea
- [ ] Show shortcuts in tooltips or help dialog

**Keyboard Shortcut Hook:**
```typescript
import { useEffect } from 'react';

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options?: {
    ctrl?: boolean;
    meta?: boolean; // Cmd on Mac
    shift?: boolean;
    enabled?: boolean;
  }
) {
  useEffect(() => {
    if (options?.enabled === false) return;

    const handler = (event: KeyboardEvent) => {
      // Don't trigger if typing in input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const matchesKey = event.key.toLowerCase() === key.toLowerCase();
      const matchesCtrl = options?.ctrl ? event.ctrlKey : !event.ctrlKey;
      const matchesMeta = options?.meta ? event.metaKey : !event.metaKey;
      const matchesShift = options?.shift ? event.shiftKey : !event.shiftKey;

      if (matchesKey && matchesCtrl && matchesMeta && matchesShift) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, options]);
}

// Usage
useKeyboardShortcut('n', () => router.push('/invoices/new'));
useKeyboardShortcut('k', () => setSearchOpen(true), { meta: true });
```

## 5. UI Specifications

### Toast Styling (from DESIGN_BLUEPRINT.md Section 3)

**Toast Types:**
```tsx
// Success (green)
className="bg-success text-white border-success"

// Error (red)
className="bg-error text-white border-error"

// Warning (orange)
className="bg-warning text-white border-warning"

// Info (blue)
className="bg-info text-white border-info"

// Default
className="bg-card text-card-foreground border-border"
```

**Toast Duration:**
- Success: 3000ms (3 seconds)
- Error: 5000ms (5 seconds, longer to read)
- Warning: 4000ms
- Info: 3000ms
- Manual dismiss always available

### Loading States

**Skeleton Animation:**
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    hsl(var(--color-muted)) 25%,
    hsl(var(--color-muted) / 0.5) 50%,
    hsl(var(--color-muted)) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}
```

**Spinner:**
```tsx
<Loader2 className="h-4 w-4 animate-spin" />
// or
<div className="h-8 w-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
```

### Focus Styles

**Focus Ring:**
```css
ring-2 ring-primary ring-offset-2 ring-offset-background
```

**Focus-Visible (keyboard only):**
```css
focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
```

### Empty State Layout

**Structure:**
```tsx
<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
  <Icon className="h-12 w-12 text-muted-foreground mb-4" />
  <h3 className="text-lg font-semibold text-foreground mb-2">Title</h3>
  <p className="text-sm text-muted-foreground mb-6 max-w-md">Description</p>
  <Button>Primary Action</Button>
</div>
```

### Confirmation Dialog

**Dialog Styles:**
```tsx
// Overlay
className="fixed inset-0 bg-black/50 z-50"

// Content
className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
           bg-card border border-border rounded-lg shadow-xl 
           max-w-md w-full p-6 z-50"

// Danger button
className="bg-error text-white hover:bg-error/90"
```

## 6. Acceptance Criteria

**Toast Notifications:**
- [ ] Toast appears on all success actions (create, edit, delete)
- [ ] Toast appears on all error actions with helpful message
- [ ] Toast auto-dismisses after appropriate duration
- [ ] Max 3 toasts visible at once (stack/queue)
- [ ] Toast colors match semantic types (success green, error red)
- [ ] Toasts work in dark mode
- [ ] Toasts announced to screen readers

**Loading States:**
- [ ] All submit buttons show loading state (spinner + disabled)
- [ ] Forms disable inputs while submitting
- [ ] Tables show skeleton while loading data
- [ ] Page-level skeletons match final content structure
- [ ] Loading indicators don't block UI unnecessarily
- [ ] Can't double-submit forms (button disabled)

**Empty States:**
- [ ] All lists show empty state when no data
- [ ] Different messages for "no data" vs "no results"
- [ ] Empty states have icon, title, description
- [ ] Empty states have CTA where appropriate
- [ ] Search/filter empty states show current query
- [ ] Empty states work in dark mode

**Confirmation Dialogs:**
- [ ] All destructive actions require confirmation
- [ ] Confirmation dialog clearly states consequences
- [ ] Can cancel or confirm
- [ ] Confirmation button is red for destructive actions
- [ ] Dialog closes after action completes
- [ ] Dialog accessible (Escape closes, focus trapped)

**Accessibility:**
- [ ] All interactive elements have focus-visible ring
- [ ] Focus ring visible in light and dark mode
- [ ] Focus ring only shows on keyboard navigation (not mouse)
- [ ] All icon buttons have aria-label
- [ ] All form inputs have labels (visible or sr-only)
- [ ] Navigation has aria-current for active page
- [ ] Modal dialogs have proper ARIA attributes
- [ ] Keyboard navigation works (Tab, Enter, Escape, Arrow keys)
- [ ] Screen readers announce loading/error/success states

**Error Handling:**
- [ ] Error boundaries catch component crashes
- [ ] Error boundaries show user-friendly message
- [ ] API errors show helpful messages (not "Error 500")
- [ ] Network errors handled gracefully
- [ ] Form validation errors show inline
- [ ] Error states have retry option

**Visual Feedback:**
- [ ] All buttons have hover effect
- [ ] All buttons have active (pressed) effect
- [ ] Disabled buttons have reduced opacity
- [ ] All state transitions smooth (200ms)
- [ ] Loading spinners animate smoothly
- [ ] Modal/dropdown animations smooth

**Dark Mode:**
- [ ] All new components work in dark mode
- [ ] Toasts readable in dark mode
- [ ] Focus rings visible in dark mode
- [ ] Empty states readable in dark mode
- [ ] Error states readable in dark mode

**Performance:**
- [ ] No layout shift during loading
- [ ] Toasts don't cause performance issues (many toasts)
- [ ] Animations smooth (60fps)
- [ ] No memory leaks (toast cleanup)

## 7. Manual Test Checklist

### Pre-Testing Setup
- [ ] Clear browser cache and localStorage
- [ ] Test in incognito/private window
- [ ] Test on multiple browsers (Chrome, Safari, Firefox)
- [ ] Test on mobile device (optional but recommended)
- [ ] Prepare test data (invoices, clients)

### Toast Notification Tests

**Test 1: Success Toasts**
1. Create new invoice
2. **Expected:** Green success toast appears: "Invoice created successfully"
3. **Expected:** Toast auto-dismisses after 3 seconds
4. Edit invoice
5. **Expected:** Green toast: "Invoice updated successfully"
6. Mark invoice as paid
7. **Expected:** Green toast: "Invoice marked as Paid"

**Test 2: Error Toasts**
1. Try to create invoice with missing required field (trigger validation error)
2. **Expected:** Red error toast appears: "Failed to create invoice"
3. **Expected:** Error message helpful (not "Error 500")
4. **Expected:** Toast stays longer (~5 seconds)
5. Try to delete client with invoices (if protected)
6. **Expected:** Red toast: "Cannot delete client: has invoices"

**Test 3: Toast Stacking**
1. Trigger 5 toasts in quick succession (create, edit, delete multiple items)
2. **Expected:** Max 3 toasts visible at once
3. **Expected:** Older toasts dismissed or queued
4. **Expected:** No toasts overlap

**Test 4: Toast in Dark Mode**
1. Toggle to dark mode
2. Trigger success toast
3. **Expected:** Toast readable with dark background
4. Trigger error toast
5. **Expected:** Error toast readable

**Test 5: Toast Accessibility**
1. Use screen reader (or test with aria-live)
2. Trigger toast
3. **Expected:** Toast message announced to screen reader
4. Navigate with keyboard while toast visible
5. **Expected:** Can dismiss toast with keyboard (if dismissible)

### Loading State Tests

**Test 6: Form Loading**
1. Fill invoice creation form
2. Click "Save"
3. **Expected:** Button shows spinner icon
4. **Expected:** Button text changes to "Saving..." or shows spinner + original text
5. **Expected:** Button disabled (can't click again)
6. **Expected:** Form inputs disabled or have reduced opacity
7. Wait for save to complete
8. **Expected:** Loading state clears, redirects or shows success

**Test 7: Table Loading (Skeleton)**
1. Navigate to /invoices
2. Throttle network (DevTools: Fast 3G)
3. **Expected:** Skeleton table shows immediately
4. **Expected:** Skeleton has 5 rows, matches table structure
5. **Expected:** Shimmer animation visible
6. Wait for data load
7. **Expected:** Skeleton replaced with actual data (no layout shift)

**Test 8: Page Loading**
1. Navigate to /dashboard
2. **Expected:** Dashboard skeleton shows while data loading
3. **Expected:** KPI cards and charts show skeleton structure
4. Data loads
5. **Expected:** Skeleton replaced smoothly

**Test 9: Inline Loading (Button)**
1. Click "Download PDF"
2. **Expected:** Button shows spinner while PDF generates
3. PDF ready
4. **Expected:** Download starts, spinner clears

**Test 10: Prevent Double Submit**
1. Fill form, click "Save" twice rapidly
2. **Expected:** Only one save request sent (button disabled after first click)

### Empty State Tests

**Test 11: No Invoices (Fresh Account)**
1. Delete all invoices or use fresh account
2. Navigate to /invoices
3. **Expected:** EmptyState shows
4. **Expected:** Icon (FileText), title "No invoices yet", description
5. **Expected:** "Create Invoice" button visible
6. Click button
7. **Expected:** Navigates to /invoices/new

**Test 12: No Results (Search)**
1. Have invoices, search for non-existent term ("ZZZZZ")
2. **Expected:** EmptyState shows: "No invoices found"
3. **Expected:** Different message from "no invoices yet"
4. **Expected:** Shows search term in message
5. **Expected:** "Clear Search" button visible
6. Click "Clear Search"
7. **Expected:** All invoices reappear

**Test 13: No Clients**
1. Delete all clients
2. Navigate to /clients
3. **Expected:** EmptyState: "No clients yet"
4. **Expected:** "Add Client" CTA

**Test 14: Empty States in Dark Mode**
1. Toggle dark mode
2. Navigate to empty list (no invoices)
3. **Expected:** EmptyState readable (light text on dark background)
4. **Expected:** Icon visible

### Confirmation Dialog Tests

**Test 15: Delete Invoice Confirmation**
1. Open invoice detail
2. Click "Delete" button
3. **Expected:** Confirmation dialog appears
4. **Expected:** Title: "Delete Invoice"
5. **Expected:** Description: "Are you sure? This action cannot be undone."
6. **Expected:** "Cancel" and "Delete Invoice" buttons
7. **Expected:** Delete button is red (destructive variant)
8. Click "Cancel"
9. **Expected:** Dialog closes, invoice NOT deleted
10. Reopen dialog, click "Delete Invoice"
11. **Expected:** Invoice deleted, success toast, redirects to list

**Test 16: Delete with Loading**
1. Open delete dialog
2. Throttle network (simulate slow delete)
3. Click "Delete Invoice"
4. **Expected:** Delete button shows spinner
5. **Expected:** Delete button disabled
6. **Expected:** Cancel button disabled (can't cancel during delete)
7. Delete completes
8. **Expected:** Dialog closes, toast appears

**Test 17: Delete Client with Invoices**
1. Create client with invoices
2. Try to delete client
3. **Expected:** Confirmation dialog appears with warning: "This client has X invoices"
4. **Expected:** Can still proceed or cancel
5. Or: Dialog doesn't appear, error toast shows instead (if delete blocked)

**Test 18: Dialog Accessibility**
1. Open confirmation dialog
2. Press Tab
3. **Expected:** Focus moves to "Cancel" button
4. Press Tab again
5. **Expected:** Focus moves to "Confirm" button
6. Press Escape
7. **Expected:** Dialog closes (no action taken)
8. Reopen dialog with keyboard (if trigger is focused, press Enter)
9. **Expected:** Dialog opens, focus trapped inside

### Accessibility Tests

**Test 19: Focus-Visible (Keyboard Navigation)**
1. Press Tab repeatedly to navigate through page
2. **Expected:** Blue focus ring appears on each interactive element
3. **Expected:** Focus ring clearly visible in light mode
4. Toggle dark mode, Tab again
5. **Expected:** Focus ring clearly visible in dark mode
6. Click element with mouse
7. **Expected:** Focus ring does NOT appear on mouse click

**Test 20: Icon Button ARIA**
1. Inspect icon-only buttons (theme toggle, delete, etc.)
2. **Expected:** All have aria-label attribute
3. **Expected:** aria-label describes action (e.g., "Delete invoice", "Toggle theme")
4. Test with screen reader
5. **Expected:** Button purpose announced

**Test 21: Form Input Labels**
1. Inspect all form inputs
2. **Expected:** All have associated <label> elements
3. **Expected:** Labels have `htmlFor` matching input `id`
4. **Expected:** If label hidden, has `sr-only` class (still readable by screen reader)
5. Focus input with error
6. **Expected:** Error message has `id`, input has `aria-describedby` pointing to error

**Test 22: Navigation ARIA**
1. Navigate to different pages
2. Inspect active navigation link
3. **Expected:** Active link has `aria-current="page"`
4. **Expected:** Other links don't have `aria-current`

**Test 23: Modal ARIA**
1. Open modal (confirmation, create client, etc.)
2. Inspect modal element
3. **Expected:** Modal has `role="dialog"` or `role="alertdialog"`
4. **Expected:** Modal has `aria-labelledby` pointing to title
5. **Expected:** Modal has `aria-describedby` pointing to description
6. Press Tab
7. **Expected:** Focus stays inside modal (focus trap)
8. Close modal
9. **Expected:** Focus returns to trigger element

**Test 24: Screen Reader Announcements**
1. Use screen reader (VoiceOver on Mac, NVDA on Windows)
2. Trigger loading state
3. **Expected:** Screen reader announces "Loading..." (aria-live)
4. Trigger success toast
5. **Expected:** Screen reader announces success message
6. Trigger error
7. **Expected:** Screen reader announces error message

**Test 25: Keyboard Shortcuts (if implemented)**
1. Press `n` on invoices list page
2. **Expected:** Navigates to /invoices/new
3. Press `Cmd+K` (Mac) or `Ctrl+K` (Windows)
4. **Expected:** Search input focused
5. Type in input, press `n`
6. **Expected:** Nothing happens (shortcut disabled while typing)
7. Press `Escape`
8. **Expected:** Closes modal/dropdown (if open)

### Error Handling Tests

**Test 26: Error Boundary (Component Crash)**
1. Simulate component error (throw error in component)
2. **Expected:** Error boundary catches error
3. **Expected:** User-friendly error message shows: "Something went wrong"
4. **Expected:** "Try Again" button visible
5. **Expected:** Error logged to console
6. Click "Try Again"
7. **Expected:** Error boundary resets, component re-renders

**Test 27: API Error Handling**
1. Disconnect network (DevTools: Offline)
2. Try to create invoice
3. **Expected:** Error toast: "Failed to create invoice"
4. **Expected:** Error message helpful (not "NetworkError")
5. Reconnect network
6. Retry
7. **Expected:** Works

**Test 28: Form Validation Errors**
1. Submit form with empty required field
2. **Expected:** Inline error message below field
3. **Expected:** Field has red border
4. **Expected:** Submit button disabled OR form doesn't submit
5. **Expected:** Focus moves to first error field
6. Fill field correctly
7. **Expected:** Error clears

**Test 29: 404 / Not Found**
1. Navigate to non-existent route (/invoices/fake-id)
2. **Expected:** 404 page or error message
3. **Expected:** User-friendly message, not technical error
4. **Expected:** Link to go back or go home

### Visual Feedback Tests

**Test 30: Hover States**
1. Hover over button
2. **Expected:** Background color changes (slightly darker or lighter)
3. **Expected:** Transition smooth (200ms)
4. Hover over table row
5. **Expected:** Row background changes
6. Hover over link
7. **Expected:** Underline appears or color changes

**Test 31: Active (Pressed) States**
1. Click and hold button (don't release)
2. **Expected:** Button appears "pressed" (darker background or scale)
3. Release
4. **Expected:** Returns to hover state

**Test 32: Disabled States**
1. View disabled button (e.g., submit button when form invalid)
2. **Expected:** Button has reduced opacity (~50%)
3. **Expected:** Cursor is `not-allowed` on hover
4. Try to click
5. **Expected:** Nothing happens

**Test 33: Transitions**
1. Toggle theme (light ↔ dark)
2. **Expected:** Background colors transition smoothly (200ms)
3. **Expected:** Text colors transition smoothly
4. Open modal
5. **Expected:** Modal fades in and scales up smoothly
6. Close modal
7. **Expected:** Modal fades out smoothly

**Test 34: Loading Spinners**
1. Trigger loading state with spinner
2. **Expected:** Spinner rotates smoothly (no jank)
3. **Expected:** Animation continuous (doesn't pause)

### Dark Mode Tests

**Test 35: All Components in Dark Mode**
1. Toggle to dark mode
2. Navigate to each page:
   - Dashboard
   - Invoices list
   - Invoice detail
   - Invoice create/edit
   - Clients list
   - Client edit
   - Company profile
3. For each page:
   - **Expected:** Background dark
   - **Expected:** Text readable (light color)
   - **Expected:** Cards have dark background
   - **Expected:** Borders visible
   - **Expected:** Focus rings visible
   - **Expected:** Toasts readable
   - **Expected:** Modals readable
   - **Expected:** Empty states readable

### Performance Tests

**Test 36: Toast Performance**
1. Trigger 10 toasts in rapid succession
2. **Expected:** No lag or performance degradation
3. **Expected:** Toasts dismissed/queued correctly
4. **Expected:** No memory leaks (check DevTools memory)

**Test 37: Animation Performance**
1. Open DevTools Performance tab
2. Record while opening/closing modals, triggering toasts
3. **Expected:** Frame rate stays at ~60fps
4. **Expected:** No long tasks (>50ms)

**Test 38: Large Table Loading**
1. Create 100 invoices
2. Navigate to /invoices
3. **Expected:** Skeleton shows immediately
4. **Expected:** Page loads in <3 seconds
5. **Expected:** Table renders without lag

### Regression Tests

**Test 39: All Existing Features Work**
1. Create invoice
2. **Expected:** Works, shows toast
3. Edit invoice
4. **Expected:** Works, shows toast
5. Delete invoice
6. **Expected:** Shows confirmation, works, shows toast
7. Download PDF
8. **Expected:** Works (with loading indicator)
9. Send email
10. **Expected:** Works (with loading indicator and toast)

**Test 40: No Visual Regressions**
1. Compare app before and after changes
2. **Expected:** All pages render correctly
3. **Expected:** No layout shifts
4. **Expected:** No broken styles
5. **Expected:** Spacing consistent
6. **Expected:** Colors correct (light and dark)

## 8. Rollback Plan

### If Critical Issues Detected

**Option A: Quick Disable Features**

If specific feature is broken:

1. **Toast System:**
   ```tsx
   // In app/layout.tsx, comment out ToastProvider
   // <ToastProvider />
   
   // In pages, comment out toast calls
   // toast.success('...')
   ```

2. **Confirmation Dialogs:**
   ```tsx
   // In delete handlers, skip confirmation
   // setDeleteDialogOpen(true) → handleDelete()
   ```

3. **Error Boundaries:**
   ```tsx
   // Remove ErrorBoundary wrapper
   // <ErrorBoundary>{children}</ErrorBoundary> → {children}
   ```

4. **Loading States:**
   ```tsx
   // Replace LoadingButton with Button
   // <LoadingButton loading={...}> → <Button disabled={loading}>
   ```

**Option B: Revert Specific Commits**

```bash
# Find commits that added micro-UX features
git log --oneline | grep -i "toast\|loading\|empty\|confirm\|accessibility" | head -10

# Revert specific commit
git revert COMMIT_HASH

# Or revert multiple commits
git revert COMMIT_HASH_1 COMMIT_HASH_2 COMMIT_HASH_3

# Verify build
npm run build

# Deploy
```

**Option C: Full Rollback (Git)**

```bash
# Find commit before micro-UX slice
git log --oneline | head -20

# Reset to commit before changes
git reset --hard COMMIT_BEFORE_CHANGES

# Force push (if already deployed)
git push --force origin main

# Or create revert commit (safer)
git revert HEAD~5..HEAD  # Revert last 5 commits
git push origin main
```

### Verification After Rollback

- [ ] App loads without errors
- [ ] All pages accessible
- [ ] All CRUD operations work (create, edit, delete)
- [ ] No console errors
- [ ] Build succeeds (`npm run build`)
- [ ] Existing features work (PDF, email, etc.)

### Partial Rollback Strategy

If only one feature is broken:

1. **Identify broken feature** (e.g., toasts causing performance issues)
2. **Disable that feature only** (comment out ToastProvider)
3. **Keep other improvements** (loading states, empty states, accessibility)
4. **Fix issue incrementally**
5. **Re-enable feature** once fixed

**Example: Disable Toasts Only**
```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* <ToastProvider /> */} {/* Temporarily disabled */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

// In pages, toasts will fail silently (no-op)
// toast.success(...) → does nothing (no error)
```

### Incremental Rollout (if preferred)

Instead of deploying all at once:

1. **Week 1:** Deploy toast system only
2. **Week 2:** Add loading states
3. **Week 3:** Add confirmation dialogs
4. **Week 4:** Add accessibility improvements
5. **Week 5:** Final polish

This allows testing each feature in production before adding more.

---

## Success Criteria Summary

**Must Have (Blocking):**
- [ ] Toast notifications on all user actions (success, error)
- [ ] Loading states on all async operations (forms, API calls)
- [ ] Empty states on all lists (no data, no results)
- [ ] Confirmation dialogs on all destructive actions
- [ ] Focus-visible styles on all interactive elements
- [ ] ARIA labels on all icon buttons and navigation
- [ ] All existing features work (no regressions)

**Should Have (High Priority):**
- [ ] Error boundaries catch component crashes
- [ ] Form validation errors inline with helpful messages
- [ ] Screen reader announcements for loading/success/error
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Dark mode works for all new components
- [ ] Smooth transitions (200ms) on all state changes
- [ ] Page-level loading skeletons match content structure

**Nice to Have (Polish):**
- [ ] Toast stacking/queuing (max 3 visible)
- [ ] Keyboard shortcuts (n for new, Cmd+K for search)
- [ ] Skip to main content link
- [ ] Success animations (checkmark, etc.)
- [ ] Progress indicators for multi-step operations

**Build Requirements:**
- [ ] TypeScript compiles (0 errors)
- [ ] ESLint passes
- [ ] `npm run build` succeeds
- [ ] No console errors
- [ ] No console warnings (address if possible)

---

## Notes for Cursor

**Before Starting:**
1. Verify toast library choice (sonner recommended, but check existing)
2. Check if shadcn/ui AlertDialog exists (for confirmations)
3. Identify all user actions that need toasts
4. Identify all async operations that need loading states
5. Report any blockers or unclear patterns

**During Implementation:**
1. **Start with toast system** (foundation for feedback)
2. **Add toasts to one page** (test thoroughly before spreading)
3. **Add loading states** (forms first, then API calls)
4. **Add confirmations** (delete actions first)
5. **Add accessibility** (ARIA labels, focus styles)
6. **Add error boundaries** (wrap critical sections)

**Implementation Order:**
1. Toast system setup (provider, utility functions)
2. Add toasts to invoice create/edit (high-value)
3. Add loading states to forms (prevents double-submit)
4. Add confirmation dialogs (delete invoice, delete client)
5. Add ARIA labels (navigation, buttons, forms)
6. Add focus-visible styles (global CSS)
7. Add error boundaries (page-level wrappers)
8. Add keyboard shortcuts (optional, if time)

**After Implementation:**
1. Run manual tests (at least Tests 1-25 from checklist)
2. Test with keyboard only (no mouse)
3. Test with screen reader (VoiceOver or NVDA)
4. Verify build succeeds
5. Check for console errors
6. Test dark mode on all pages
7. Report any deviations from spec

**If Stuck:**
1. Report exact issue (file path, error, context)
2. Suggest workaround (skip feature, simplify)
3. Ask for clarification
4. Don't refactor unrelated code

**Testing Priority:**
1. **Critical:** Toasts on save/delete, confirmations, loading states
2. **Important:** Accessibility (ARIA, focus), empty states
3. **Nice:** Keyboard shortcuts, animations

**Common Pitfalls:**
- Don't add toasts to every action (only user-initiated actions)
- Don't block UI unnecessarily (use optimistic updates where safe)
- Don't over-animate (subtle transitions only)
- Don't break existing keyboard navigation
- Don't assume screen reader behavior (test it)

---

**End of context.md**

This document provides complete, actionable instructions for adding comprehensive micro-UX polish to the Invoice SaaS application. The focus is on feedback mechanisms, graceful degradation, and accessibility improvements that transform the app into a production-ready product. Follow steps incrementally, test thoroughly, and maintain existing functionality at all costs. Good luck! ✨🎯♿