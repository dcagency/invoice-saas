'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RevenueChartProps {
  data: Array<{ month: string; revenue: number }>
}

export default function RevenueChart({ data }: RevenueChartProps) {
  // Transform month format for display (YYYY-MM -> MMM YYYY)
  const chartData = data.map((item) => ({
    ...item,
    monthLabel: new Date(item.month + '-01').toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
  }))

  const hasData = data.some((d) => d.revenue > 0)

  // Get theme-aware colors
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  const gridColor = isDark ? 'hsl(var(--color-border))' : '#E5E7EB'
  const textColor = isDark ? 'hsl(var(--color-muted-foreground))' : '#6B7280'
  const tooltipBg = isDark ? 'hsl(var(--color-card))' : '#fff'
  const tooltipBorder = isDark ? 'hsl(var(--color-border))' : '#E5E7EB'
  const lineColor = 'hsl(var(--color-primary))'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Month</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <p>No paid invoices yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="monthLabel"
                tick={{ fontSize: 12, fill: textColor }}
                stroke={textColor}
              />
              <YAxis
                tick={{ fontSize: 12, fill: textColor }}
                stroke={textColor}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value: number) => `$${value.toFixed(2)}`}
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '6px',
                  color: isDark ? 'hsl(var(--color-foreground))' : undefined,
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={lineColor}
                strokeWidth={2}
                dot={{ fill: lineColor, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

