'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatusChartProps {
  data: Array<{ status: string; count: number }>
}

// Theme-aware colors using CSS variables
const getColors = () => {
  if (typeof window === 'undefined') {
    return {
      DRAFT: 'hsl(var(--color-draft))',
      SENT: 'hsl(var(--color-sent))',
      PAID: 'hsl(var(--color-paid))',
    }
  }
  const isDark = document.documentElement.classList.contains('dark')
  return {
    DRAFT: isDark ? 'hsl(var(--color-draft))' : '#9CA3AF',
    SENT: isDark ? 'hsl(var(--color-sent))' : '#3B82F6',
    PAID: isDark ? 'hsl(var(--color-paid))' : '#10B981',
  }
}

export default function StatusChart({ data }: StatusChartProps) {
  const hasData = data.some((d) => d.count > 0)
  const colors = getColors()
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  const textColor = isDark ? 'hsl(var(--color-foreground))' : '#374151'
  const tooltipBg = isDark ? 'hsl(var(--color-card))' : '#fff'
  const tooltipBorder = isDark ? 'hsl(var(--color-border))' : '#E5E7EB'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices by Status</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <p>No invoices yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry) => `${entry.status}: ${entry.count}`}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={colors[entry.status as keyof typeof colors]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '6px',
                  color: textColor,
                }}
              />
              <Legend wrapperStyle={{ color: textColor }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

