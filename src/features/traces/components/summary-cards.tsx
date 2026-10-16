import type { SummaryResponse } from '@/api/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { formatCost, formatInteger, formatLatency } from '@/shared/utils/format'

interface SummaryMetric {
  label: string
  format: (summary: SummaryResponse) => string
}

const METRICS: readonly SummaryMetric[] = [
  { label: 'Trazas', format: (summary) => formatInteger(summary.trace_count) },
  { label: 'Coste total', format: (summary) => formatCost(summary.total_cost) },
  { label: 'Tokens totales', format: (summary) => formatInteger(summary.total_tokens) },
  { label: 'Latencia media', format: (summary) => formatLatency(summary.average_latency) },
]

interface SummaryCardsProps {
  /** Undefined while loading: each card shows a skeleton instead of its value. */
  summary: SummaryResponse | undefined
}

/** The four headline metrics of the range, as computed by the backend. */
export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {METRICS.map(({ label, format }) => (
        <Card key={label} className="gap-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
          </CardHeader>
          <CardContent>
            {summary ? (
              <p className="text-2xl font-semibold tabular-nums">{format(summary)}</p>
            ) : (
              <Skeleton data-testid="summary-skeleton" className="h-8 w-24" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
