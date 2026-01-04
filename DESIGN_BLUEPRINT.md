# DESIGN_BLUEPRINT.md - Invoice SaaS Premium UI

## Table of Contents
1. [UX Objectives](#1-ux-objectives)
2. [Design Tokens](#2-design-tokens)
3. [UI Rules & Principles](#3-ui-rules--principles)
4. [Component Standards](#4-component-standards)
5. [Global Layout](#5-global-layout)
6. [Page-by-Page Polish Checklist](#6-page-by-page-polish-checklist)
7. [Do's & Don'ts](#7-dos--donts)

---

## 1. UX Objectives

### Core Principles

**🎯 Simplicity**
- Remove visual noise and unnecessary elements
- One primary action per screen/section
- Progressive disclosure: show advanced options only when needed
- Clear visual hierarchy with typography and spacing

**🔒 Trust & Professionalism**
- Consistent, polished visual design
- Clear data presentation (invoices, amounts, dates)
- Professional PDF outputs that reflect well on users
- Security indicators (user isolation, data privacy)

**⚡ Speed & Efficiency**
- Instant visual feedback on all interactions
- Optimistic updates where safe
- Skeleton loaders, not spinners (show structure while loading)
- Smart defaults and auto-suggestions (invoice numbers, dates)
- Keyboard shortcuts for power users

**✨ Friction Reduction**
- Inline validation with helpful error messages
- Contextual help and tooltips
- Prevent errors before they happen (disabled states, warnings)
- Undo/retry options where possible
- Auto-save where appropriate (forms)

### Success Metrics
- Time to create first invoice: <2 minutes
- Error rate on invoice creation: <5%
- User can find any feature in <10 seconds
- Professional PDF output quality: 9/10 rating
- Dark mode adoption: 30%+ of users

---

## 2. Design Tokens

### Color System

**CSS Variables (`:root` and `.dark`)**

```css
:root {
  /* Brand Colors */
  --color-primary: 220 90% 56%;        /* Blue #3B82F6 */
  --color-primary-hover: 220 90% 50%; 
  --color-primary-active: 220 90% 44%;
  
  /* Semantic Colors - Light Mode */
  --color-background: 0 0% 100%;       /* White #FFFFFF */
  --color-foreground: 222 47% 11%;     /* Near-black #0F172A */
  
  --color-card: 0 0% 100%;             /* White */
  --color-card-foreground: 222 47% 11%;
  
  --color-muted: 210 40% 96%;          /* Light gray #F1F5F9 */
  --color-muted-foreground: 215 16% 47%; /* Mid gray #64748B */
  
  --color-accent: 210 40% 96%;         /* Light blue-gray */
  --color-accent-foreground: 222 47% 11%;
  
  --color-border: 214 32% 91%;         /* Border gray #E2E8F0 */
  --color-input: 214 32% 91%;
  --color-ring: 220 90% 56%;           /* Focus ring = primary */
  
  /* Status Colors */
  --color-success: 142 71% 45%;        /* Green #10B981 */
  --color-success-bg: 142 71% 95%;
  --color-warning: 38 92% 50%;         /* Orange #F59E0B */
  --color-warning-bg: 38 92% 95%;
  --color-error: 0 84% 60%;            /* Red #EF4444 */
  --color-error-bg: 0 84% 95%;
  --color-info: 199 89% 48%;           /* Cyan #0EA5E9 */
  --color-info-bg: 199 89% 95%;
  
  /* Invoice Status Colors */
  --color-draft: 215 16% 47%;          /* Gray #64748B */
  --color-draft-bg: 215 20% 95%;
  --color-sent: 199 89% 48%;           /* Blue #0EA5E9 */
  --color-sent-bg: 199 89% 95%;
  --color-paid: 142 71% 45%;           /* Green #10B981 */
  --color-paid-bg: 142 71% 95%;
  --color-overdue: 0 84% 60%;          /* Red #EF4444 */
  --color-overdue-bg: 0 84% 95%;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  
  /* Border Radius */
  --radius-sm: 0.25rem;   /* 4px - tight elements */
  --radius-md: 0.375rem;  /* 6px - inputs, buttons */
  --radius-lg: 0.5rem;    /* 8px - cards */
  --radius-xl: 0.75rem;   /* 12px - modals */
  --radius-2xl: 1rem;     /* 16px - feature cards */
  
  /* Spacing Scale (matches Tailwind) */
  --spacing-1: 0.25rem;   /* 4px */
  --spacing-2: 0.5rem;    /* 8px */
  --spacing-3: 0.75rem;   /* 12px */
  --spacing-4: 1rem;      /* 16px */
  --spacing-6: 1.5rem;    /* 24px */
  --spacing-8: 2rem;      /* 32px */
  --spacing-12: 3rem;     /* 48px */
  --spacing-16: 4rem;     /* 64px */
}

.dark {
  /* Semantic Colors - Dark Mode */
  --color-background: 222 47% 11%;     /* Near-black #0F172A */
  --color-foreground: 210 40% 98%;     /* Off-white #F8FAFC */
  
  --color-card: 217 33% 17%;           /* Dark card #1E293B */
  --color-card-foreground: 210 40% 98%;
  
  --color-muted: 217 33% 17%;          /* Dark gray #1E293B */
  --color-muted-foreground: 215 20% 65%; /* Light gray #94A3B8 */
  
  --color-accent: 217 33% 17%;
  --color-accent-foreground: 210 40% 98%;
  
  --color-border: 217 33% 23%;         /* Border dark #334155 */
  --color-input: 217 33% 23%;
  --color-ring: 220 90% 56%;
  
  /* Status Colors - Dark Mode (slightly desaturated) */
  --color-success: 142 71% 40%;
  --color-success-bg: 142 71% 15%;
  --color-warning: 38 92% 45%;
  --color-warning-bg: 38 92% 15%;
  --color-error: 0 84% 55%;
  --color-error-bg: 0 84% 15%;
  --color-info: 199 89% 43%;
  --color-info-bg: 199 89% 15%;
  
  /* Invoice Status - Dark Mode */
  --color-draft: 215 20% 55%;
  --color-draft-bg: 215 20% 20%;
  --color-sent: 199 89% 43%;
  --color-sent-bg: 199 89% 15%;
  --color-paid: 142 71% 40%;
  --color-paid-bg: 142 71% 15%;
  --color-overdue: 0 84% 55%;
  --color-overdue-bg: 0 84% 15%;
  
  /* Shadows - Dark Mode (lighter, more subtle) */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.3);
}
```

**Tailwind Config Extension**

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--color-border))',
        input: 'hsl(var(--color-input))',
        ring: 'hsl(var(--color-ring))',
        background: 'hsl(var(--color-background))',
        foreground: 'hsl(var(--color-foreground))',
        primary: {
          DEFAULT: 'hsl(var(--color-primary))',
          hover: 'hsl(var(--color-primary-hover))',
          active: 'hsl(var(--color-primary-active))',
        },
        muted: {
          DEFAULT: 'hsl(var(--color-muted))',
          foreground: 'hsl(var(--color-muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--color-accent))',
          foreground: 'hsl(var(--color-accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--color-card))',
          foreground: 'hsl(var(--color-card-foreground))',
        },
        status: {
          draft: 'hsl(var(--color-draft))',
          'draft-bg': 'hsl(var(--color-draft-bg))',
          sent: 'hsl(var(--color-sent))',
          'sent-bg': 'hsl(var(--color-sent-bg))',
          paid: 'hsl(var(--color-paid))',
          'paid-bg': 'hsl(var(--color-paid-bg))',
          overdue: 'hsl(var(--color-overdue))',
          'overdue-bg': 'hsl(var(--color-overdue-bg))',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
    },
  },
}
```

### Typography

**Font Stack**
```css
:root {
  --font-sans: 'Inter var', system-ui, -apple-system, sans-serif;
  --font-mono: 'Fira Code', 'Consolas', monospace;
}
```

**Type Scale**
```css
:root {
  /* Display (Landing, Marketing) */
  --text-display-2xl: 4.5rem;    /* 72px */
  --text-display-xl: 3.75rem;    /* 60px */
  --text-display-lg: 3rem;       /* 48px */
  
  /* Headings (App UI) */
  --text-3xl: 2.25rem;           /* 36px - Page titles */
  --text-2xl: 1.875rem;          /* 30px - Section titles */
  --text-xl: 1.5rem;             /* 24px - Card titles */
  --text-lg: 1.25rem;            /* 20px - Subsections */
  
  /* Body */
  --text-base: 1rem;             /* 16px - Default body */
  --text-sm: 0.875rem;           /* 14px - Secondary text */
  --text-xs: 0.75rem;            /* 12px - Captions, helper text */
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

**Tailwind Typography Classes**
```
text-display-2xl → 72px, font-bold, leading-tight
text-display-xl  → 60px, font-bold, leading-tight
text-3xl         → 36px, font-bold, leading-tight (Page title)
text-2xl         → 30px, font-semibold, leading-tight (Section title)
text-xl          → 24px, font-semibold, leading-normal (Card title)
text-lg          → 20px, font-medium, leading-normal (Subsection)
text-base        → 16px, font-normal, leading-normal (Body)
text-sm          → 14px, font-normal, leading-normal (Secondary)
text-xs          → 12px, font-normal, leading-relaxed (Helper)
```

---

## 3. UI Rules & Principles

### Density & Spacing

**Content Density**
- **Desktop:** Comfortable spacing, max-width 1280px for readability
- **Tablet:** Medium density, slight padding reduction
- **Mobile:** High density, minimize vertical scroll

**Spacing Scale (use consistently)**
```
xs:  4px  (tight spacing, within components)
sm:  8px  (component internal padding)
md:  12px (between related elements)
base: 16px (default spacing, component gaps)
lg:  24px (section spacing)
xl:  32px (major section separation)
2xl: 48px (page-level spacing)
```

**Padding Standards**
- Buttons: `px-4 py-2` (base), `px-6 py-3` (large)
- Cards: `p-6` (desktop), `p-4` (mobile)
- Inputs: `px-3 py-2` (base)
- Modals: `p-6` (desktop), `p-4` (mobile)
- Page container: `px-4 sm:px-6 lg:px-8`

### Accessibility (WCAG AA)

**Contrast Requirements**
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- Interactive elements: 3:1 minimum against background

**Focus States**
- All interactive elements MUST have visible focus ring
- Focus ring: `ring-2 ring-primary ring-offset-2`
- Never remove outline without replacement

**Keyboard Navigation**
- Tab order follows visual order
- Escape closes modals and dropdowns
- Enter/Space activates buttons and toggles
- Arrow keys navigate lists and menus

**Screen Readers**
- All images have alt text
- Form inputs have labels (visible or sr-only)
- Buttons have descriptive text or aria-label
- Status changes announced (aria-live)

### Interactive States

**Standard State Progression**

```tsx
// Base state
className="bg-white text-foreground"

// Hover state
className="hover:bg-muted hover:text-foreground"

// Focus state
className="focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"

// Active/Pressed state
className="active:bg-primary-active"

// Disabled state
className="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
```

**Button States (Primary)**
```tsx
// Normal
bg-primary text-white hover:bg-primary-hover active:bg-primary-active
focus:ring-2 focus:ring-primary focus:ring-offset-2
transition-colors duration-200

// Disabled
disabled:opacity-50 disabled:cursor-not-allowed
```

**Button States (Secondary)**
```tsx
// Normal
bg-white border border-border text-foreground
hover:bg-muted hover:border-muted-foreground
active:bg-accent
focus:ring-2 focus:ring-primary focus:ring-offset-2
transition-colors duration-200

// Disabled
disabled:opacity-50 disabled:cursor-not-allowed
```

**Input States**
```tsx
// Normal
border border-input bg-background text-foreground
focus:ring-2 focus:ring-primary focus:border-primary
transition-colors duration-200

// Error
border-error focus:ring-error focus:border-error

// Disabled
disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-60
```

### Loading States

**Skeleton Loaders (Preferred)**
```tsx
// Card skeleton
<div className="bg-card border border-border rounded-lg p-6 animate-pulse">
  <div className="h-6 w-1/3 bg-muted rounded mb-4"></div>
  <div className="h-4 w-full bg-muted rounded mb-2"></div>
  <div className="h-4 w-2/3 bg-muted rounded"></div>
</div>

// Table row skeleton
<tr className="animate-pulse">
  <td><div className="h-4 w-24 bg-muted rounded"></div></td>
  <td><div className="h-4 w-32 bg-muted rounded"></div></td>
  <td><div className="h-4 w-20 bg-muted rounded"></div></td>
</tr>
```

**Spinner (Use sparingly)**
```tsx
// Only for: button loading states, small inline operations
<svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
</svg>
```

**Progressive Loading**
```
1. Show page structure immediately (skeleton)
2. Load critical data first (KPIs, recent items)
3. Load secondary data (charts, full lists)
4. Never block entire UI for one component
```

### Empty States

**Structure**
```tsx
<div className="text-center py-12 px-4">
  {/* Icon */}
  <div className="mx-auto w-16 h-16 text-muted-foreground mb-4">
    <IconComponent />
  </div>
  
  {/* Primary message */}
  <h3 className="text-lg font-semibold text-foreground mb-2">
    No invoices yet
  </h3>
  
  {/* Secondary message */}
  <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
    Create your first invoice to start tracking your revenue and getting paid faster.
  </p>
  
  {/* Primary action */}
  <Button>Create Invoice</Button>
  
  {/* Optional: Secondary action or help link */}
  <a href="/docs" className="text-sm text-primary hover:underline mt-4 block">
    Learn how to create an invoice
  </a>
</div>
```

**Guidelines**
- Always provide a clear path forward (CTA button)
- Use encouraging, helpful tone (not error-like)
- Icon should relate to content type (invoice, client, etc.)
- Keep text concise (1 heading + 1-2 sentences max)

### Toast Notifications

**Types & Usage**
```tsx
// Success (green)
toast.success("Invoice created successfully", {
  description: "Invoice #INV-001 has been created",
  duration: 3000,
});

// Error (red)
toast.error("Failed to create invoice", {
  description: "Please check your input and try again",
  duration: 5000,
});

// Warning (orange)
toast.warning("Invoice already sent", {
  description: "Editing may cause confusion for the client",
  duration: 4000,
});

// Info (blue)
toast.info("Auto-save enabled", {
  description: "Your changes are being saved automatically",
  duration: 2000,
});
```

**Positioning**
- Desktop: Top-right corner
- Mobile: Top-center, full-width

**Guidelines**
- Show for user-initiated actions (save, delete, send)
- Auto-dismiss after 3-5 seconds (except errors)
- Errors can be dismissed manually
- Max 3 toasts visible at once (stack or queue)
- Include actionable error messages ("Check your input" not just "Error")

---

## 4. Component Standards

### Button

**Variants**

```tsx
// Primary (main actions)
<Button variant="primary">
  Create Invoice
</Button>
// Classes: bg-primary text-white hover:bg-primary-hover

// Secondary (less important actions)
<Button variant="secondary">
  Cancel
</Button>
// Classes: bg-white border border-border text-foreground hover:bg-muted

// Ghost (tertiary actions)
<Button variant="ghost">
  View Details
</Button>
// Classes: bg-transparent hover:bg-muted text-foreground

// Destructive (delete, irreversible actions)
<Button variant="destructive">
  Delete Invoice
</Button>
// Classes: bg-error text-white hover:bg-error/90

// Link (text-only, no background)
<Button variant="link">
  Learn more
</Button>
// Classes: text-primary underline-offset-4 hover:underline
```

**Sizes**
```tsx
// Small (tables, compact UIs)
<Button size="sm">Save</Button>
// Classes: text-xs px-3 py-1.5

// Default
<Button size="default">Save</Button>
// Classes: text-sm px-4 py-2

// Large (primary CTAs, landing pages)
<Button size="lg">Get Started</Button>
// Classes: text-base px-6 py-3
```

**States**
```tsx
// Loading
<Button disabled>
  <Spinner className="mr-2" />
  Saving...
</Button>

// Disabled
<Button disabled>
  Save Draft
</Button>

// With icon
<Button>
  <PlusIcon className="mr-2 h-4 w-4" />
  Create Invoice
</Button>
```

**Guidelines**
- One primary button per section/page
- Icon + text for better scannability
- Loading state disables button, shows spinner
- Disabled state has reduced opacity (0.5)
- Destructive actions require confirmation (modal)

### Input

**Base Input**
```tsx
<div className="space-y-2">
  <label htmlFor="email" className="text-sm font-medium text-foreground">
    Email
  </label>
  <input
    id="email"
    type="email"
    placeholder="you@example.com"
    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground
               focus:ring-2 focus:ring-primary focus:border-primary
               disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-60
               placeholder:text-muted-foreground"
  />
  <p className="text-xs text-muted-foreground">
    We'll never share your email with anyone else.
  </p>
</div>
```

**Error State**
```tsx
<div className="space-y-2">
  <label htmlFor="email" className="text-sm font-medium text-foreground">
    Email
  </label>
  <input
    id="email"
    type="email"
    aria-invalid="true"
    aria-describedby="email-error"
    className="w-full px-3 py-2 border border-error rounded-md bg-background text-foreground
               focus:ring-2 focus:ring-error focus:border-error"
  />
  <p id="email-error" className="text-xs text-error">
    Please enter a valid email address.
  </p>
</div>
```

**Input Variations**
- **Text input:** Default
- **Textarea:** `rows={4}` min, auto-resize for notes
- **Number input:** Right-aligned for amounts
- **Date input:** Native date picker or shadcn Calendar
- **Search input:** Left search icon, clear button (X) when filled

### Select / Dropdown

**Standard Select**
```tsx
<div className="space-y-2">
  <label htmlFor="status" className="text-sm font-medium text-foreground">
    Status
  </label>
  <select
    id="status"
    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground
               focus:ring-2 focus:ring-primary focus:border-primary
               disabled:bg-muted disabled:cursor-not-allowed"
  >
    <option value="">Select status</option>
    <option value="DRAFT">Draft</option>
    <option value="SENT">Sent</option>
    <option value="PAID">Paid</option>
  </select>
</div>
```

**Custom Select (shadcn/ui recommended)**
- Better styling control
- Searchable for long lists (clients, products)
- Multi-select support
- Disabled options

**Guidelines**
- Default option: "Select..." or context-specific ("All Statuses")
- Sort alphabetically or by relevance
- Show selection count in multi-select
- Keyboard navigation (arrow keys, type-ahead)

### Card

**Base Card**
```tsx
<div className="bg-card border border-border rounded-lg shadow-sm p-6">
  <h3 className="text-lg font-semibold text-card-foreground mb-2">
    Invoice Summary
  </h3>
  <p className="text-sm text-muted-foreground">
    Overview of your invoicing activity
  </p>
  {/* Card content */}
</div>
```

**Interactive Card (Clickable)**
```tsx
<div className="bg-card border border-border rounded-lg shadow-sm p-6
                hover:shadow-md hover:border-primary/50
                transition-all duration-200 cursor-pointer">
  {/* Card content */}
</div>
```

**Card with Header & Footer**
```tsx
<div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
  {/* Header */}
  <div className="border-b border-border px-6 py-4">
    <h3 className="text-lg font-semibold text-card-foreground">
      Recent Invoices
    </h3>
  </div>
  
  {/* Body */}
  <div className="p-6">
    {/* Content */}
  </div>
  
  {/* Footer */}
  <div className="border-t border-border px-6 py-4 bg-muted/30">
    <button className="text-sm text-primary hover:underline">
      View all invoices →
    </button>
  </div>
</div>
```

**Guidelines**
- Consistent padding (p-6 desktop, p-4 mobile)
- Subtle shadow (shadow-sm), increased on hover
- Border for definition in light mode
- Group related information in one card
- Max 3 cards per row on desktop

### Table

**Responsive Table**
```tsx
{/* Desktop: Table */}
<div className="hidden md:block overflow-x-auto">
  <table className="w-full">
    <thead className="bg-muted/50 border-y border-border">
      <tr>
        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Invoice
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Client
        </th>
        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Amount
        </th>
        <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Status
        </th>
        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-border bg-card">
      <tr className="hover:bg-muted/30 transition-colors">
        <td className="px-4 py-4 text-sm font-medium text-foreground">
          INV-001
        </td>
        <td className="px-4 py-4 text-sm text-foreground">
          Acme Corp
        </td>
        <td className="px-4 py-4 text-sm text-right font-semibold text-foreground">
          $1,250.00
        </td>
        <td className="px-4 py-4 text-center">
          <Badge variant="paid">Paid</Badge>
        </td>
        <td className="px-4 py-4 text-right">
          <Button variant="ghost" size="sm">View</Button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

{/* Mobile: Cards */}
<div className="md:hidden space-y-4">
  <div className="bg-card border border-border rounded-lg p-4">
    <div className="flex justify-between items-start mb-2">
      <div>
        <p className="font-semibold text-foreground">INV-001</p>
        <p className="text-sm text-muted-foreground">Acme Corp</p>
      </div>
      <Badge variant="paid">Paid</Badge>
    </div>
    <div className="flex justify-between items-center mt-4">
      <span className="text-lg font-semibold text-foreground">$1,250.00</span>
      <Button variant="ghost" size="sm">View</Button>
    </div>
  </div>
</div>
```

**Guidelines**
- Sticky header on scroll (long tables)
- Hover row highlight
- Right-align numbers (amounts, quantities)
- Left-align text (names, descriptions)
- Center-align status badges and icons
- Responsive: table → cards on mobile (<768px)
- Empty state when no rows

### Badge (Status Indicators)

**Invoice Status Badges**
```tsx
// Draft
<Badge variant="draft">
  Draft
</Badge>
// Classes: bg-status-draft-bg text-status-draft border border-status-draft/20

// Sent
<Badge variant="sent">
  Sent
</Badge>
// Classes: bg-status-sent-bg text-status-sent border border-status-sent/20

// Paid
<Badge variant="paid">
  Paid
</Badge>
// Classes: bg-status-paid-bg text-status-paid border border-status-paid/20

// Overdue
<Badge variant="overdue">
  Overdue
</Badge>
// Classes: bg-status-overdue-bg text-status-overdue border border-status-overdue/20
```

**Badge Component**
```tsx
interface BadgeProps {
  variant?: 'draft' | 'sent' | 'paid' | 'overdue' | 'default';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

const Badge = ({ variant = 'default', size = 'md', children }: BadgeProps) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full border';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };
  
  const variantClasses = {
    draft: 'bg-status-draft-bg text-status-draft border-status-draft/20',
    sent: 'bg-status-sent-bg text-status-sent border-status-sent/20',
    paid: 'bg-status-paid-bg text-status-paid border-status-paid/20',
    overdue: 'bg-status-overdue-bg text-status-overdue border-status-overdue/20',
    default: 'bg-muted text-muted-foreground border-border',
  };
  
  return (
    <span className={cn(baseClasses, sizeClasses[size], variantClasses[variant])}>
      {children}
    </span>
  );
};
```

**Guidelines**
- Use semantic colors (green = success, red = error)
- Keep text short (1-2 words max)
- Don't use badges for actions (use buttons)
- Consistent sizing across app

### Modal / Dialog

**Modal Structure**
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-[500px]">
    {/* Header */}
    <DialogHeader>
      <DialogTitle>Delete Invoice</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this invoice? This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    
    {/* Body */}
    <div className="py-4">
      {/* Modal content */}
    </div>
    
    {/* Footer */}
    <DialogFooter>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete Invoice
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Modal Sizes**
```tsx
// Small (confirmations)
sm:max-w-[400px]

// Medium (forms)
sm:max-w-[600px]

// Large (complex forms, previews)
sm:max-w-[800px]

// Full-width (mobile always full-width)
max-w-full sm:max-w-[600px]
```

**Guidelines**
- Overlay backdrop (bg-black/50)
- Center on screen
- Close on backdrop click, Escape key, X button
- Focus trap (Tab cycles within modal)
- Scroll body if content overflows, not entire modal
- Max one modal open at a time

### Tabs

**Horizontal Tabs**
```tsx
<Tabs defaultValue="details" className="w-full">
  <TabsList className="border-b border-border">
    <TabsTrigger value="details">
      Details
    </TabsTrigger>
    <TabsTrigger value="history">
      History
    </TabsTrigger>
    <TabsTrigger value="settings">
      Settings
    </TabsTrigger>
  </TabsList>
  
  <TabsContent value="details" className="py-6">
    {/* Details content */}
  </TabsContent>
  
  <TabsContent value="history" className="py-6">
    {/* History content */}
  </TabsContent>
  
  <TabsContent value="settings" className="py-6">
    {/* Settings content */}
  </TabsContent>
</Tabs>
```

**Tab Styling**
```tsx
// Trigger (inactive)
className="px-4 py-2 text-sm font-medium text-muted-foreground
           hover:text-foreground transition-colors
           border-b-2 border-transparent"

// Trigger (active)
className="px-4 py-2 text-sm font-medium text-primary
           border-b-2 border-primary"
```

**Guidelines**
- Use for content organization, not navigation
- 3-5 tabs max (more = consider different UI)
- Keyboard navigation (arrow keys)
- Indicate active tab clearly (border + color)

---

## 5. Global Layout

### Layout Structure

**Desktop (>1024px)**
```
┌─────────────────────────────────────────┐
│  Sidebar (240px)  │  Main Content       │
│                   │                     │
│  • Logo           │  Topbar             │
│  • Navigation     │  ─────────────────  │
│  • User menu      │                     │
│                   │  Page Content       │
│                   │  (max-w-7xl)        │
│                   │                     │
│                   │                     │
└─────────────────────────────────────────┘
```

**Tablet (768px - 1023px)**
```
┌─────────────────────────────────────────┐
│  Topbar (with hamburger)                │
├─────────────────────────────────────────┤
│                                         │
│  Main Content                           │
│  (full-width, px-6)                     │
│                                         │
│  Sidebar: overlay on toggle             │
│                                         │
└─────────────────────────────────────────┘
```

**Mobile (<768px)**
```
┌──────────────────┐
│  Topbar + burger │
├──────────────────┤
│                  │
│  Main Content    │
│  (full-width,    │
│   px-4)          │
│                  │
│  Bottom nav or   │
│  overlay sidebar │
└──────────────────┘
```

### Sidebar

**Structure**
```tsx
<aside className="w-64 bg-card border-r border-border h-screen fixed left-0 top-0
                  hidden lg:block overflow-y-auto">
  {/* Logo */}
  <div className="h-16 flex items-center px-6 border-b border-border">
    <Logo className="h-8 w-auto" />
    <span className="ml-2 text-xl font-bold text-foreground">Invoice</span>
  </div>
  
  {/* Navigation */}
  <nav className="p-4 space-y-1">
    <NavLink href="/dashboard" icon={HomeIcon}>
      Dashboard
    </NavLink>
    <NavLink href="/invoices" icon={InvoiceIcon}>
      Invoices
    </NavLink>
    <NavLink href="/clients" icon={UsersIcon}>
      Clients
    </NavLink>
    <NavLink href="/company" icon={BuildingIcon}>
      Company
    </NavLink>
  </nav>
  
  {/* User menu (bottom) */}
  <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
    <UserMenuButton />
  </div>
</aside>
```

**NavLink Component**
```tsx
const NavLink = ({ href, icon: Icon, children, active }) => (
  
    href={href}
    className={cn(
      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
      active
        ? "bg-primary text-white"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    )}
  >
    <Icon className="mr-3 h-5 w-5" />
    {children}
  </a>
);
```

**Mobile Sidebar (Overlay)**
```tsx
{/* Backdrop */}
<div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeSidebar} />

{/* Sidebar */}
<aside className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-50
                  transform transition-transform lg:hidden
                  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}">
  {/* Same content as desktop */}
</aside>
```

### Topbar

**Desktop (with Sidebar)**
```tsx
<header className="h-16 border-b border-border bg-background
                   ml-64 lg:ml-64 flex items-center justify-between px-6">
  {/* Breadcrumbs (optional) */}
  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
    <a href="/dashboard" className="hover:text-foreground">Dashboard</a>
    <ChevronRightIcon className="h-4 w-4" />
    <span className="text-foreground font-medium">Invoices</span>
  </div>
  
  {/* Actions */}
  <div className="flex items-center space-x-4">
    <SearchButton />
    <NotificationsButton />
    <ThemeToggle />
  </div>
</header>
```

**Mobile (No Sidebar)**
```tsx
<header className="h-16 border-b border-border bg-background
                   flex items-center justify-between px-4">
  {/* Hamburger */}
  <button onClick={toggleSidebar} className="lg:hidden">
    <MenuIcon className="h-6 w-6" />
  </button>
  
  {/* Logo */}
  <Logo className="h-8 w-auto" />
  
  {/* Actions */}
  <div className="flex items-center space-x-2">
    <ThemeToggle />
    <UserMenuButton />
  </div>
</header>
```

### Page Container

**Standard Page**
```tsx
<div className="min-h-screen bg-background">
  {/* Topbar */}
  <Topbar />
  
  {/* Main content */}
  <main className="ml-0 lg:ml-64 p-4 sm:p-6 lg:p-8">
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
        <p className="text-muted-foreground mt-2">
          Manage and track all your invoices
        </p>
      </div>
      
      {/* Page content */}
      <div className="space-y-6">
        {/* Content sections */}
      </div>
    </div>
  </main>
</div>
```

**Max-width Guidelines**
- **Dashboard:** `max-w-7xl` (1280px) - allow wide analytics charts
- **Forms:** `max-w-4xl` (896px) - comfortable reading width
- **Lists/Tables:** `max-w-7xl` - show more data
- **Settings:** `max-w-3xl` (768px) - narrow for readability

### Responsive Breakpoints

```css
/* Tailwind defaults - use these */
sm: 640px   /* Mobile landscape, small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large desktop */
```

**Usage Patterns**
- **Mobile-first:** Base styles = mobile, add `sm:`, `md:`, `lg:` for larger screens
- **Sidebar:** Hide on `< lg`, show on `lg:`
- **Grid columns:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Padding:** `px-4 sm:px-6 lg:px-8`

---

## 6. Page-by-Page Polish Checklist

### Dashboard (`/dashboard`)

**Layout**
```
┌─────────────────────────────────────────┐
│  Page Header                            │
│  • Title: "Dashboard"                   │
│  • Subtitle: "Overview of your invoices"│
├─────────────────────────────────────────┤
│  KPI Cards (4-column grid)              │
│  • Total Revenue                        │
│  • Monthly Revenue                      │
│  • Total Invoices                       │
│  • Avg Invoice Value                    │
├─────────────────────────────────────────┤
│  Charts (2-column grid)                 │
│  • Revenue by Month                     │
│  • Invoices by Status                   │
├─────────────────────────────────────────┤
│  Recent Invoices (optional)             │
│  • Table/list of last 5 invoices        │
└─────────────────────────────────────────┘
```

**Polish Checklist**
- [ ] **KPI Cards:** Consistent height, subtle shadow, hover effect
- [ ] **KPI Values:** Large, bold numbers; secondary text in muted color
- [ ] **Charts:** Consistent colors (match status badges), clear axes, tooltips
- [ ] **Empty State:** Show if no invoices, CTA to create first invoice
- [ ] **Loading:** Skeleton for each KPI card and chart
- [ ] **Responsive:** 4→2→1 columns on smaller screens
- [ ] **Dark Mode:** Charts adapt colors, maintain readability
- [ ] **Spacing:** Consistent gaps between sections (space-y-8)

**Code Example: KPI Card**
```tsx
<Card>
  <CardHeader className="pb-2">
    <CardTitle className="text-sm font-medium text-muted-foreground">
      Total Revenue
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold text-foreground">
      $45,231.89
    </div>
    <p className="text-xs text-muted-foreground mt-1">
      +20.1% from last month
    </p>
  </CardContent>
</Card>
```

### Invoices List (`/invoices`)

**Layout**
```
┌─────────────────────────────────────────┐
│  Page Header + Primary Action           │
│  • Title: "Invoices"                    │
│  • Button: "Create Invoice" (primary)   │
├─────────────────────────────────────────┤
│  Filters & Search                       │
│  • Search input (invoice #, client)     │
│  • Status filter dropdown               │
│  • Client filter dropdown               │
│  • Active filters chips (clearable)     │
├─────────────────────────────────────────┤
│  Invoices Table (Desktop)               │
│  Columns: Number | Client | Date |      │
│           Amount | Status | Actions     │
│                                         │
│  OR                                     │
│                                         │
│  Invoice Cards (Mobile)                 │
│  • Stacked cards, status badge visible │
└─────────────────────────────────────────┘
```

**Polish Checklist**
- [ ] **Table Header:** Sticky on scroll, subtle background (bg-muted/50)
- [ ] **Hover Row:** Subtle background change (hover:bg-muted/30)
- [ ] **Status Badges:** Consistent colors, rounded-full
- [ ] **Actions Column:** Ghost buttons or dropdown menu (•••)
- [ ] **Search:** Clear button (X) when text entered, debounced
- [ ] **Filters:** Show count of results, "Clear all" button when active
- [ ] **Empty State:** "No invoices found" with illustration
- [ ] **Loading:** Table skeleton (5-10 rows)
- [ ] **Pagination:** If >50 invoices, show page controls (future)
- [ ] **Responsive:** Table → Cards on mobile
- [ ] **Bulk Actions:** Checkboxes for multi-select (future)
- [ ] **Quick Actions:** Duplicate, Send Email icons on hover

**Code Example: Table Row**
```tsx
<tr className="hover:bg-muted/30 transition-colors border-b border-border">
  <td className="px-4 py-4">
    <a href={`/invoices/${invoice.id}`} className="font-medium text-primary hover:underline">
      {invoice.invoiceNumber}
    </a>
  </td>
  <td className="px-4 py-4 text-foreground">
    {invoice.client.companyName}
  </td>
  <td className="px-4 py-4 text-muted-foreground text-sm">
    {formatDate(invoice.issueDate)}
  </td>
  <td className="px-4 py-4 text-right font-semibold text-foreground">
    ${invoice.total.toFixed(2)}
  </td>
  <td className="px-4 py-4 text-center">
    <Badge variant={getBadgeVariant(invoice.status)}>
      {invoice.status}
    </Badge>
  </td>
  <td className="px-4 py-4 text-right">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVerticalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>View</DropdownMenuItem>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem>Send Email</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-error">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </td>
</tr>
```

### Invoice Detail (`/invoices/[id]`)

**Layout**
```
┌─────────────────────────────────────────┐
│  Breadcrumbs: Dashboard > Invoices > #  │
├─────────────────────────────────────────┤
│  Header                                 │
│  • Invoice Number (large)               │
│  • Status Badge                         │
│  • Actions: Edit | Duplicate | Email |  │
│             Download PDF | Delete       │
├─────────────────────────────────────────┤
│  Invoice Info Card                      │
│  • Issue Date, Due Date                 │
│  • Client info (company, address)       │
│  • Notes (if any)                       │
├─────────────────────────────────────────┤
│  Line Items Table                       │
│  • Description | Qty | Unit Price | Tot │
│  • Subtotal, Tax, Total (right-aligned) │
└─────────────────────────────────────────┘
```

**Polish Checklist**
- [ ] **Header:** Large invoice number (text-3xl), status badge prominent
- [ ] **Actions Bar:** Sticky on scroll, clear separation (border-b)
- [ ] **Info Card:** Two-column layout (Invoice details | Client details)
- [ ] **Line Items:** Clear table, right-align numbers, bold totals
- [ ] **Totals Section:** Right-aligned, larger font for final total
- [ ] **Notes:** Subtle background (bg-muted/30), italic text
- [ ] **Overdue Indicator:** Red banner if past due date and not paid
- [ ] **Loading:** Skeleton for entire invoice structure
- [ ] **Empty Line Items:** Should never happen, but show message
- [ ] **Print-Friendly:** Hide actions, clean layout for print
- [ ] **Responsive:** Stack columns on mobile
- [ ] **Dark Mode:** Ensure PDF download works (PDF is always light)

**Code Example: Totals Section**
```tsx
<div className="mt-8 flex justify-end">
  <div className="w-full max-w-sm space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">Subtotal:</span>
      <span className="font-medium text-foreground">
        ${invoice.subtotal.toFixed(2)}
      </span>
    </div>
    
    {invoice.taxRate && (
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Tax ({invoice.taxRate}%):</span>
        <span className="font-medium text-foreground">
          ${invoice.taxAmount.toFixed(2)}
        </span>
      </div>
    )}
    
    <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
      <span className="text-foreground">Total:</span>
      <span className="text-foreground">
        ${invoice.total.toFixed(2)}
      </span>
    </div>
  </div>
</div>
```

### Create/Edit Invoice (`/invoices/new`, `/invoices/[id]/edit`)

**Layout**
```
┌─────────────────────────────────────────┐
│  Page Header                            │
│  • Title: "Create Invoice" or "Edit"    │
│  • Auto-save indicator (optional)       │
├─────────────────────────────────────────┤
│  Form Section: Basic Info               │
│  • Client (select/search)               │
│  • Invoice Number (auto-suggested)      │
│  • Issue Date, Due Date (date pickers)  │
│  • Status (dropdown)                    │
├─────────────────────────────────────────┤
│  Form Section: Line Items               │
│  • Dynamic rows (add/remove)            │
│  • Description | Qty | Price | Total    │
│  • Real-time calculation preview        │
├─────────────────────────────────────────┤
│  Form Section: Tax & Notes              │
│  • Tax rate (percentage input)          │
│  • Notes (textarea)                     │
├─────────────────────────────────────────┤
│  Totals Preview (sticky sidebar)        │
│  • Subtotal, Tax, Total (live update)   │
├─────────────────────────────────────────┤
│  Actions                                │
│  • Save Draft | Save & Send | Cancel    │
└─────────────────────────────────────────┘
```

**Polish Checklist**
- [ ] **Client Select:** Searchable, create new inline option
- [ ] **Invoice Number:** Pre-filled with suggestion, editable
- [ ] **Date Pickers:** Native or shadcn Calendar, default to today
- [ ] **Line Items:** Add row button, delete icon per row, min 1 row
- [ ] **Calculations:** Real-time updates as user types
- [ ] **Totals Sidebar:** Sticky on desktop, bottom card on mobile
- [ ] **Validation:** Inline errors (red border + message below field)
- [ ] **Required Fields:** Asterisk (*) or "Required" label
- [ ] **Save Draft:** Always available, auto-save every 30s (optional)
- [ ] **Unsaved Changes:** Warning if navigating away with changes
- [ ] **Loading State:** Disable form, show saving indicator
- [ ] **Success:** Toast notification + redirect to detail page
- [ ] **Error Handling:** Show errors above form, focus first invalid field
- [ ] **Responsive:** Single column on mobile, two-column on desktop
- [ ] **Dark Mode:** Form inputs readable, proper contrast

**Code Example: Line Item Row**
```tsx
<div className="grid grid-cols-12 gap-4 items-start">
  <div className="col-span-5">
    <Input
      placeholder="Description"
      value={item.description}
      onChange={(e) => updateItem(index, 'description', e.target.value)}
    />
  </div>
  
  <div className="col-span-2">
    <Input
      type="number"
      placeholder="Qty"
      value={item.quantity}
      onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
      className="text-right"
    />
  </div>
  
  <div className="col-span-2">
    <Input
      type="number"
      placeholder="Price"
      value={item.unitPrice}
      onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
      className="text-right"
    />
  </div>
  
  <div className="col-span-2 flex items-center justify-end">
    <span className="font-semibold text-foreground">
      ${(item.quantity * item.unitPrice).toFixed(2)}
    </span>
  </div>
  
  <div className="col-span-1 flex items-center justify-end">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => removeItem(index)}
      disabled={lineItems.length === 1}
    >
      <TrashIcon className="h-4 w-4 text-error" />
    </Button>
  </div>
</div>
```

### Clients List (`/clients`)

**Layout**
```
┌─────────────────────────────────────────┐
│  Page Header + Primary Action           │
│  • Title: "Clients"                     │
│  • Button: "Add Client" (primary)       │
├─────────────────────────────────────────┤
│  Search & Filters                       │
│  • Search input (name, email)           │
├─────────────────────────────────────────┤
│  Clients Table/Grid                     │
│  Desktop: Table with columns            │
│  Mobile: Cards with key info            │
│                                         │
│  Columns: Name | Email | Phone |        │
│           Invoices Count | Actions      │
└─────────────────────────────────────────┘
```

**Polish Checklist**
- [ ] **Table/Cards:** Consistent with invoices list styling
- [ ] **Client Name:** Linked to detail/edit page
- [ ] **Invoice Count:** Click to filter invoices by client
- [ ] **Actions:** Edit, Delete (with confirmation if invoices exist)
- [ ] **Search:** Debounced, searches name and email
- [ ] **Empty State:** "No clients yet" with CTA
- [ ] **Loading:** Skeleton table/cards
- [ ] **Delete Protection:** Disable if client has invoices, show tooltip
- [ ] **Responsive:** Table → Cards on mobile
- [ ] **Dark Mode:** Consistent with other list pages

### Company Profile (`/company/edit`)

**Layout**
```
┌─────────────────────────────────────────┐
│  Page Header                            │
│  • Title: "Company Profile"             │
│  • Subtitle: "Your business information"│
├─────────────────────────────────────────┤
│  Form: Company Details                  │
│  • Company Name (required)              │
│  • Contact Name, Email, Phone           │
│  • Address (Street, City, State, Zip,   │
│    Country)                             │
│  • Tax ID / VAT Number                  │
├─────────────────────────────────────────┤
│  Profile Completion Indicator           │
│  • Progress bar or checklist            │
│  • "Profile 80% complete"               │
├─────────────────────────────────────────┤
│  Actions                                │
│  • Save Changes (primary)               │
│  • Cancel                               │
└─────────────────────────────────────────┘
```

**Polish Checklist**
- [ ] **Required Fields:** Clear indicators, validation
- [ ] **Completion Badge:** Green if complete, orange if incomplete
- [ ] **Address Fields:** Group visually (border or background)
- [ ] **Validation:** Inline errors, disable save if incomplete
- [ ] **Success:** Toast + update completion badge
- [ ] **Profile Guard:** Warn on invoice creation if incomplete
- [ ] **Loading:** Skeleton form
- [ ] **Responsive:** Single column, full-width inputs on mobile
- [ ] **Dark Mode:** Form readable, proper contrast

---

## 7. Do's & Don'ts

### ✅ DO

**Visual Polish**
- **DO** use consistent spacing (Tailwind spacing scale)
- **DO** add subtle shadows and borders for depth
- **DO** use hover states on all interactive elements
- **DO** show loading skeletons that match final content structure
- **DO** use semantic colors (green = success, red = error)
- **DO** maintain 4.5:1 contrast ratio for text (WCAG AA)
- **DO** add transitions for smooth interactions (duration-200)
- **DO** use empty states with helpful CTAs
- **DO** test dark mode on every page

**Component Usage**
- **DO** use shadcn/ui components if already present
- **DO** extract reusable components (Button, Badge, Card)
- **DO** keep component APIs simple and predictable
- **DO** document component variants in code comments
- **DO** use TypeScript for all components

**User Experience**
- **DO** provide instant feedback on user actions (toasts, state changes)
- **DO** show helpful error messages (not "Error 500")
- **DO** auto-focus first input on page load (forms)
- **DO** add keyboard shortcuts for common actions
- **DO** make forms forgiving (auto-save, undo, retry)

**Responsive Design**
- **DO** test on mobile (375px), tablet (768px), desktop (1280px)
- **DO** use mobile-first approach (base styles = mobile)
- **DO** stack elements vertically on mobile
- **DO** hide non-essential info on small screens
- **DO** make touch targets ≥44px on mobile

**Accessibility**
- **DO** use semantic HTML (`<button>`, `<nav>`, `<main>`)
- **DO** add alt text to all images
- **DO** ensure keyboard navigation works (Tab, Enter, Escape)
- **DO** add aria-labels to icon-only buttons
- **DO** test with keyboard only (no mouse)

### ❌ DON'T

**Code Changes**
- **DON'T** rename database fields or API endpoints
- **DON'T** change API route paths or request/response formats
- **DON'T** refactor business logic or calculations
- **DON'T** modify Prisma schema or run migrations
- **DON'T** change authentication flow or security checks
- **DON'T** remove existing features or functionality
- **DON'T** change file/folder structure without reason

**Visual Design**
- **DON'T** use more than 3 brand colors (primary + success/error)
- **DON'T** mix border styles (always use border-border)
- **DON'T** use random spacing values (stick to scale)
- **DON'T** add animations longer than 300ms
- **DON'T** use pure black (#000) or pure white (#FFF) for text
- **DON'T** rely on color alone (use icons + text for status)
- **DON'T** use low-contrast text (<3:1 ratio)

**Components**
- **DON'T** create new components for one-off uses (copy-paste is OK)
- **DON'T** add heavy dependencies (bundle size matters)
- **DON'T** use different UI libraries (stick to shadcn or migrate all)
- **DON'T** over-abstract (not every div needs a component)
- **DON'T** ignore TypeScript errors (fix them)

**User Experience**
- **DON'T** remove confirmation dialogs for destructive actions
- **DON'T** auto-submit forms without user consent
- **DON'T** use generic error messages ("Something went wrong")
- **DON'T** hide critical information behind hover/tooltips
- **DON'T** use modal for non-critical content (use inline instead)
- **DON'T** auto-play videos or animations
- **DON'T** disable zoom on mobile (bad for accessibility)

**Performance**
- **DON'T** load unnecessary data on page load
- **DON'T** render large tables without virtualization (>100 rows)
- **DON'T** block UI for background operations
- **DON'T** use unoptimized images (compress, use WebP)
- **DON'T** import entire libraries (tree-shake or use specific imports)

**Accessibility**
- **DON'T** remove focus outlines without replacement
- **DON'T** use `<div>` for clickable elements (use `<button>`)
- **DON'T** rely on hover-only interactions (mobile can't hover)
- **DON'T** forget to trap focus in modals
- **DON'T** use placeholder as label (invisible to screen readers)

---

## Implementation Strategy

### Phase 1: Foundation (Week 1)
1. **Install shadcn/ui** (if not present) or audit existing components
2. **Set up design tokens** (CSS variables, Tailwind config)
3. **Implement dark mode toggle** (theme provider, local storage)
4. **Create base components** (Button, Input, Card, Badge)
5. **Set up global layout** (Sidebar, Topbar, page container)

### Phase 2: Core Pages (Week 2)
1. **Polish Dashboard** (KPIs, charts, empty state)
2. **Polish Invoices List** (table, filters, search, actions)
3. **Polish Invoice Detail** (layout, totals, actions)
4. **Test responsive** (mobile, tablet, desktop)
5. **Test dark mode** (all pages)

### Phase 3: Forms & Flows (Week 3)
1. **Polish Create/Edit Invoice** (form validation, line items, totals)
2. **Polish Clients List** (table, search, actions)
3. **Polish Company Profile** (form, completion indicator)
4. **Add loading states** (skeletons everywhere)
5. **Add empty states** (all lists and tables)

### Phase 4: Polish & QA (Week 4)
1. **Accessibility audit** (keyboard nav, screen reader, contrast)
2. **Performance audit** (bundle size, load times, interactions)
3. **Cross-browser testing** (Chrome, Safari, Firefox)
4. **Mobile testing** (iOS, Android)
5. **Final dark mode pass** (ensure all components work)

---

## Success Criteria

### Visual Quality
- [ ] Every page looks intentional and polished
- [ ] Consistent spacing, colors, typography throughout
- [ ] Dark mode works on all pages without issues
- [ ] No visual regressions on existing features

### User Experience
- [ ] Users can complete core tasks in <5 clicks
- [ ] Error messages are helpful and actionable
- [ ] Loading states show structure (skeletons, not spinners)
- [ ] Empty states encourage next action

### Technical
- [ ] All existing features work (no breaks)
- [ ] Build succeeds with no warnings
- [ ] TypeScript has no errors
- [ ] Bundle size increase <50KB

### Accessibility
- [ ] WCAG AA compliance (4.5:1 contrast)
- [ ] Keyboard navigation works on all pages
- [ ] Focus states visible on all interactive elements
- [ ] Screen reader test passes (basic)

### Responsive
- [ ] Works on mobile (375px), tablet (768px), desktop (1280px+)
- [ ] Touch targets ≥44px on mobile
- [ ] Text readable without zoom on all devices

---

**End of DESIGN_BLUEPRINT.md**

This blueprint provides a complete design system and implementation guide. Follow it incrementally, test frequently, and maintain existing functionality at all costs. Good luck! 🎨✨