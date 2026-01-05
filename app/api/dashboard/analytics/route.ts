import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/api/error-handler'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // CRITICAL: Authentication check (first line)
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // CRITICAL: Fetch all invoices for this user (filtered by userId)
    const invoices = await prisma.invoice.findMany({
      where: { userId }, // CRITICAL: multi-tenant safety
      select: {
        status: true,
        totalAmount: true, // Note: field is totalAmount, not total
        issueDate: true,
      },
    })

    // Calculate KPIs
    const paidInvoices = invoices.filter((inv) => inv.status === 'PAID')
    const sentInvoices = invoices.filter((inv) => inv.status === 'SENT')
    const draftInvoices = invoices.filter((inv) => inv.status === 'DRAFT')

    const totalRevenue = paidInvoices.reduce(
      (sum, inv) => sum + Number(inv.totalAmount),
      0
    )

    const currentMonth = new Date().toISOString().slice(0, 7) // "YYYY-MM"
    const monthlyRevenue = paidInvoices
      .filter((inv) => inv.issueDate.toISOString().slice(0, 7) === currentMonth)
      .reduce((sum, inv) => sum + Number(inv.totalAmount), 0)

    const averageInvoiceValue =
      paidInvoices.length > 0 ? totalRevenue / paidInvoices.length : 0

    // Prepare revenue by month (last 12 months)
    const monthsData = new Map<string, number>()
    const now = new Date()

    // Initialize last 12 months with 0
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toISOString().slice(0, 7)
      monthsData.set(monthKey, 0)
    }

    // Aggregate paid invoices by month
    paidInvoices.forEach((inv) => {
      const monthKey = inv.issueDate.toISOString().slice(0, 7)
      if (monthsData.has(monthKey)) {
        monthsData.set(monthKey, monthsData.get(monthKey)! + Number(inv.totalAmount))
      }
    })

    const revenueByMonth = Array.from(monthsData.entries())
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // Prepare invoices by status
    const invoicesByStatus = [
      { status: 'DRAFT', count: draftInvoices.length },
      { status: 'SENT', count: sentInvoices.length },
      { status: 'PAID', count: paidInvoices.length },
    ]

    // Return response
    return NextResponse.json({
      kpis: {
        totalRevenue,
        monthlyRevenue,
        totalInvoices: invoices.length,
        paidInvoices: paidInvoices.length,
        sentInvoices: sentInvoices.length,
        draftInvoices: draftInvoices.length,
        averageInvoiceValue,
      },
      charts: {
        revenueByMonth,
        invoicesByStatus,
      },
    })
  } catch (error) {
    return handleApiError(error, 'GET /api/dashboard/analytics')
  }
}

