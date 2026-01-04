# Invoice SaaS - Technical Product Specification

## Product Overview

Invoice SaaS is a streamlined web application that enables freelancers and small businesses to create, manage, and generate professional invoices. The application prioritizes simplicity and speed over comprehensive accounting features. It is a tool for invoice generation and client management, not a financial advisory platform or full accounting system.

The application assumes one user per account, with each user representing one business entity. There are no multi-user workspaces, team collaboration features, or role-based access controls.

## Core User Journey

1. User signs up and authenticates via external authentication provider
2. User completes their company profile (one-time setup)
3. User adds clients to their client list
4. User creates invoices for clients by adding line items
5. User marks invoices as sent or paid
6. User downloads invoices as PDF files

## Data Models

### User
- Unique identifier
- Email address
- Created timestamp
- Authentication handled externally (no password storage)
- One-to-one relationship with Company Profile

### Company Profile
- Unique identifier
- Foreign key to User
- Company name (required)
- Contact person name
- Email address
- Phone number
- Street address
- City
- State/Province
- Postal code
- Country
- Tax ID / VAT number
- Company logo URL (optional, for future enhancement)
- Created timestamp
- Updated timestamp

### Client
- Unique identifier
- Foreign key to User (owner)
- Client company name (required)
- Contact person name
- Email address
- Phone number
- Street address
- City
- State/Province
- Postal code
- Country
- Tax ID / VAT number
- Notes (optional text field)
- Created timestamp
- Updated timestamp

### Invoice
- Unique identifier
- Foreign key to User (owner)
- Foreign key to Client
- Invoice number (user-defined string, e.g., "INV-001")
- Issue date
- Due date
- Status (enum: DRAFT, SENT, PAID)
- Subtotal (calculated field)
- Tax amount (optional, user-entered)
- Tax percentage (optional, user-entered)
- Total amount (calculated field)
- Notes (optional text for payment terms, thank you message, etc.)
- Created timestamp
- Updated timestamp

### Invoice Line Item
- Unique identifier
- Foreign key to Invoice
- Description (text)
- Quantity (decimal number, default 1)
- Unit price (decimal number)
- Line total (calculated: quantity × unit price)
- Sort order (integer, for maintaining item order)

## Application Pages and Features

### Authentication Pages
Handled by external provider (Clerk or similar). The application receives authenticated user data and creates/retrieves the User record.

### Dashboard (Home Page)
- URL: `/dashboard`
- Purpose: Landing page after login
- Displays summary cards:
  - Total invoices count
  - Count by status (draft, sent, paid)
  - Recent invoices list (last 5-10)
- Quick action buttons:
  - Create new invoice
  - Add new client
- Navigation to main sections (Invoices, Clients, Company Profile)

### Company Profile Setup
- URL: `/company/setup` or `/company/edit`
- Purpose: One-time setup wizard and ongoing profile editing
- Form fields matching Company Profile data model
- All fields editable at any time
- "Save" action updates the profile
- If profile is incomplete, user is redirected here after login until completed

### Clients List Page
- URL: `/clients`
- Purpose: Display all clients in a table or card grid
- Columns: Client name, contact person, email, city, action buttons
- Actions per client:
  - View/Edit client details
  - Delete client (with confirmation, only if no invoices exist)
- "Add New Client" button at top

### Client Detail/Edit Page
- URL: `/clients/new` (for creation) and `/clients/[id]/edit`
- Purpose: Create or edit a client
- Form fields matching Client data model
- "Save" button creates/updates client and returns to clients list
- "Cancel" button returns without saving

### Invoices List Page
- URL: `/invoices`
- Purpose: Display all invoices in a table
- Columns: Invoice number, client name, issue date, due date, total amount, status, actions
- Filter options:
  - By status (all, draft, sent, paid)
- Sort options:
  - By issue date (newest/oldest)
  - By due date
- Actions per invoice:
  - View invoice detail
  - Edit invoice (only if status is DRAFT)
  - Download PDF
  - Delete invoice (with confirmation)
- "Create New Invoice" button at top

### Invoice Creation/Edit Page
- URL: `/invoices/new` (for creation) and `/invoices/[id]/edit`
- Purpose: Create or edit an invoice
- Form sections:
  1. Invoice header:
     - Client selection (dropdown of existing clients)
     - Invoice number (text input, user-defined)
     - Issue date (date picker, defaults to today)
     - Due date (date picker, defaults to 30 days from issue date)
  2. Line items section:
     - Dynamic list of line items
     - Each row: description (text), quantity (number), unit price (number), line total (calculated, read-only)
     - "Add Line Item" button
     - "Remove" button per line item
     - Line items can be reordered (drag-and-drop or up/down buttons)
  3. Totals section (right-aligned):
     - Subtotal (calculated: sum of all line totals)
     - Tax field: optional percentage input and calculated tax amount
     - Total (calculated: subtotal + tax)
  4. Additional information:
     - Notes field (textarea, optional)
     - Status dropdown (draft, sent, paid)
- "Save as Draft" button
- "Save" button (saves and returns to invoice list)
- "Save and Download PDF" button
- All calculations happen in real-time on the client side
- Validation: client must be selected, at least one line item required, invoice number required

### Invoice Detail/View Page
- URL: `/invoices/[id]`
- Purpose: Read-only view of a complete invoice
- Displays:
  - Company information (from user's company profile) at top
  - Client information
  - Invoice number, issue date, due date
  - Table of line items with totals
  - Subtotal, tax, and total
  - Notes
  - Status badge
- Action buttons:
  - Edit invoice (redirects to edit page, only if status is DRAFT)
  - Download PDF
  - Change status (dropdown or quick buttons: Mark as Sent, Mark as Paid)
  - Delete invoice (with confirmation)
- This page can serve as a preview before generating the PDF

### PDF Generation
- Triggered from invoice detail page or edit page
- Generates a clean, professional PDF document containing:
  - Company logo placeholder or name at top
  - Company address and contact information
  - "INVOICE" heading
  - Invoice number and dates
  - "Bill To" section with client information
  - Line items table with columns: description, quantity, unit price, total
  - Subtotal, tax breakdown (if applicable), and total amount
  - Notes section at bottom
  - Simple, professional styling (black and white, clear typography)
- PDF generation happens server-side
- File is streamed to browser for download
- Filename format: `Invoice-[invoice_number]-[client_name].pdf`

## User Flows

### First-Time User Flow
1. User signs up via authentication provider
2. User is redirected to `/company/setup`
3. User fills out company profile
4. User is redirected to `/dashboard`
5. User clicks "Add New Client"
6. User fills out client form and saves
7. User returns to dashboard and clicks "Create New Invoice"
8. User selects client, adds line items, saves invoice
9. User downloads PDF or marks invoice as sent

### Returning User Flow
1. User logs in via authentication provider
2. User lands on `/dashboard`
3. User navigates to desired section (invoices, clients, company settings)
4. User performs actions (create invoice, edit client, etc.)

### Invoice Creation Flow
1. User navigates to `/invoices/new`
2. User selects client from dropdown (or clicks inline "Add New Client" link to open modal/page)
3. User enters invoice number (or app suggests next sequential number)
4. User sets issue date and due date
5. User clicks "Add Line Item" and fills in description, quantity, unit price
6. User repeats for multiple line items
7. User optionally enters tax percentage
8. User sees live-calculated totals
9. User optionally enters notes
10. User sets status (typically DRAFT for new invoices)
11. User clicks "Save" or "Save and Download PDF"
12. User is redirected to invoice detail page or invoices list

## What This Application Does NOT Do

- **No payment processing**: The app does not integrate with Stripe, PayPal, or any payment gateway. Users must handle payments outside the application.
- **No recurring invoices**: The app does not support subscription billing or automatic recurring invoice generation.
- **No expense tracking**: The app does not track business expenses or receipts.
- **No reporting or analytics**: No charts, graphs, or financial reports beyond simple counts.
- **No multi-currency support**: All amounts are entered as numbers without currency validation or conversion.
- **No tax calculation automation**: Tax is a simple optional percentage field. No jurisdiction-based tax rules.
- **No audit trail**: No change history or version tracking for invoices.
- **No email sending**: The app does not send invoices via email. Users download the PDF and send it manually.
- **No reminders**: The app does not send payment reminders to clients.
- **No team features**: One user per account. No sharing, no permissions, no collaboration.
- **No API**: No external integrations or API endpoints for third-party tools.
- **No invoice templates**: One standard PDF layout. No customization of design or branding beyond company name.
- **No time tracking**: No built-in time logging or conversion of hours to invoice line items.
- **No estimates or quotes**: Only invoices. No separate document type for estimates.

## Technical Assumptions and Constraints

### Authentication
- Authentication is handled by an external provider (e.g., Clerk, Auth0, NextAuth with Google/GitHub)
- The application receives the authenticated user's ID and email
- User records are created automatically upon first login
- No password storage or management in the application database

### Database
- PostgreSQL as the primary data store
- Prisma as the ORM
- All decimal fields (prices, quantities, totals) stored as Decimal type for precision
- All timestamps stored with timezone information
- Soft deletes are NOT implemented; deletions are hard deletes (with appropriate foreign key constraints)

### File Storage
- PDFs are generated on-demand, not stored persistently
- Optional future enhancement: store company logo images in cloud storage (S3, Cloudinary, etc.)

### Validation
- Client-side validation for immediate user feedback
- Server-side validation for all mutations (create, update, delete)
- Invoice numbers must be unique per user
- At least one line item required per invoice
- Dates must be valid; due date should be after or equal to issue date (warning, not hard block)

### Calculations
- All monetary calculations performed with precise decimal arithmetic
- Subtotal = sum of (quantity × unit price) for all line items
- Tax amount = subtotal × (tax percentage / 100)
- Total = subtotal + tax amount
- Calculations happen on both client (for live preview) and server (for storage)

### PDF Generation
- Server-side PDF generation using a library like `@react-pdf/renderer` or `puppeteer`
- PDF includes all invoice data in a clean, print-friendly layout
- PDFs are not digitally signed or encrypted

### Status Management
- Invoices start as DRAFT by default
- Status transitions: DRAFT → SENT → PAID
- Status can be changed manually at any time (no workflow enforcement)
- Once marked SENT or PAID, invoices should still be editable (no hard lock), but the UI should warn the user

### Data Ownership and Privacy
- Each user can only access their own data (company profile, clients, invoices)
- Database queries must always filter by authenticated user ID
- No shared data across users

## UI/UX Principles

- Clean, minimal interface with ample white space
- Responsive design: works on desktop, tablet, and mobile
- Primary actions clearly visible (large buttons for "Create Invoice," "Add Client," etc.)
- Destructive actions (delete) require confirmation dialogs
- Form validation errors displayed inline, near the relevant field
- Success messages displayed as toast notifications or temporary banners
- Navigation: persistent sidebar or top navigation bar with links to Dashboard, Invoices, Clients, Company Profile
- Consistent color scheme: neutral grays with one accent color for primary actions
- Tables are sortable and filterable where appropriate
- Date pickers for all date inputs
- Dropdowns for status selection and client selection
- Numeric inputs for quantities and prices (with proper step values for decimals)

## Edge Cases and Clarifications

### Invoice Numbering
- The application does not enforce sequential numbering
- The application may suggest the next number (e.g., increment the highest existing invoice number), but users can override this
- Invoice numbers must be unique per user

### Client Deletion
- Clients can only be deleted if they have no associated invoices
- If a client has invoices, the delete action is blocked with an error message

### Invoice Deletion
- Invoices can be deleted at any time, regardless of status
- Deletion is permanent and removes all associated line items

### Empty States
- If the user has no clients, the client dropdown on the invoice creation page shows "No clients found" and a link to add a client
- If the user has no invoices, the invoices list shows an empty state with a call-to-action to create the first invoice

### Tax Handling
- Tax is optional
- Tax is a simple percentage field
- The app does not validate or enforce tax rules
- Tax is applied to the subtotal, not per line item

### Currency
- The app does not specify currency
- Users enter numeric values only
- It is the user's responsibility to communicate currency to their clients (e.g., in the invoice notes or elsewhere)

### Date Handling
- All dates are stored and displayed in the user's local timezone (no timezone selection feature)
- Dates are displayed in a localized format (based on browser locale or a default format like MM/DD/YYYY or DD/MM/YYYY)

### Company Profile Completeness
- The app should check if the company profile is complete (at minimum: company name and address)
- If incomplete, the user is prompted to complete it before creating invoices
- An incomplete profile is allowed, but may result in incomplete PDFs

## Success Metrics (for context, not implementation)

- User can create their first invoice within 5 minutes of signing up
- PDF generation completes in under 3 seconds
- The application is usable without reading documentation
- Zero accounting jargon in the user interface

## Future Enhancements (out of scope for MVP, documented for context)

- Email invoices directly from the app
- Customizable invoice templates (colors, fonts, logo placement)
- Recurring invoices
- Expense tracking
- Basic reporting (revenue by month, outstanding invoices)
- Multi-currency support
- Client portal (clients can view their invoices)
- Payment reminders
- Integration with payment processors
- Time tracking and conversion to line items
- Estimates/quotes as a separate document type
- Team collaboration and multi-user accounts

---

This document defines the complete scope of the Invoice SaaS MVP. Any feature, behavior, or technical decision not explicitly mentioned here should be implemented in the simplest way that satisfies the described user flows and data models. The application is intentionally minimal and should remain so.