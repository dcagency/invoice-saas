'use client'

import { useEffect, useState } from 'react'
import KPICard from './KPICard'
import RevenueChart from './RevenueChart'
import StatusChart from './StatusChart'
import { Card } from '@/components/ui/card'

interface AnalyticsData {
  kpis: {
    totalRevenue: number
    monthlyRevenue: number
    totalInvoices: number
    paidInvoices: number
    sentInvoices: number
    draftInvoices: number
    averageInvoiceValue: number
  }
  charts: {
    revenueByMonth: Array<{ month: string; revenue: number }>
    invoicesByStatus: Array<{ status: string; count: number }>
  }
}

export default function AnalyticsSection() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch('/api/dashboard/analytics')
        if (!response.ok) throw new Error('Failed to fetch analytics')
        const analyticsData = await response.json()
        setData(analyticsData)
      } catch (err) {
        setError('Failed to load analytics')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div>
          <div className="h-8 bg-muted rounded w-48 mb-2"></div>
          <div className="h-4 bg-muted rounded w-64"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted rounded-lg h-32"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-muted rounded-lg h-80"></div>
          <div className="bg-muted rounded-lg h-80"></div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <Card className="border-error/20 bg-error-bg">
        <div className="p-4">
          <p className="text-error">Failed to load analytics. Please try again later.</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Section title */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
        <p className="text-muted-foreground mt-1">Overview of your invoicing performance</p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={`$${data.kpis.totalRevenue.toFixed(2)}`}
          subtitle="All time"
        />
        <KPICard
          title="Monthly Revenue"
          value={`$${data.kpis.monthlyRevenue.toFixed(2)}`}
          subtitle="Current month"
        />
        <KPICard
          title="Total Invoices"
          value={data.kpis.totalInvoices.toString()}
          subtitle={`${data.kpis.paidInvoices} paid, ${data.kpis.sentInvoices} sent, ${data.kpis.draftInvoices} draft`}
        />
        <KPICard
          title="Avg Invoice Value"
          value={`$${data.kpis.averageInvoiceValue.toFixed(2)}`}
          subtitle="Paid invoices"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={data.charts.revenueByMonth} />
        <StatusChart data={data.charts.invoicesByStatus} />
      </div>
    </div>
  )
}

