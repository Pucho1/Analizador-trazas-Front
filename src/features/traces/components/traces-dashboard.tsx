import { EmptyState } from '@/shared/components/empty-state'
import { ErrorState } from '@/shared/components/error-state'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

import { useTraceSummary } from '../hooks/use-trace-summary'
import { useTraces } from '../hooks/use-traces'
import { useTraceFiltersStore } from '../store/trace-filters-store'
import { SummaryCards } from './summary-cards'
import { TimeRangeSelector } from './time-range-selector'
import { TracesTable, TracesTableSkeleton } from './traces-table'

/** The traces screen: range selector, summary metrics and the table of traces. */
export function TracesDashboard() {
  const timeRange = useTraceFiltersStore((state) => state.timeRange)
  const traces = useTraces(timeRange)
  const summary = useTraceSummary(timeRange)

  // Both requests usually fail for the same reason (e.g. wrong keys): show the error once.
  const error = traces.error ?? summary.error

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Uso de los agentes</h2>
        <TimeRangeSelector />
      </div>

      {error ? (
        <ErrorState
          kind={error.kind}
          isRetrying={traces.isFetching || summary.isFetching}
          onRetry={() => {
            void traces.refetch()
            void summary.refetch()
          }}
        />
      ) : (
        <>
          <SummaryCards summary={summary.data} />
          <Card>
            <CardHeader>
              <CardTitle>Trazas</CardTitle>
            </CardHeader>
            <CardContent>
              {!traces.data ? (
                <TracesTableSkeleton />
              ) : traces.data.traces.length === 0 ? (
                <EmptyState
                  title="No hay trazas"
                  description="No se ha registrado ninguna traza en este rango de fechas."
                />
              ) : (
                <TracesTable traces={traces.data.traces} />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </section>
  )
}
