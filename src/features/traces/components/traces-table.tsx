import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react'
import { useMemo } from 'react'

import type { TraceResponse } from '@/api/types'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { cn } from '@/shared/utils/cn'
import { formatCost, formatDateTime, formatInteger, formatLatency } from '@/shared/utils/format'

import { useTraceFiltersStore } from '../store/trace-filters-store'
import { sortTraces, type TraceSort, type TraceSortColumn } from '../utils/sort-traces'

interface TraceColumn {
  column: TraceSortColumn
  label: string
  numeric: boolean
  format: (trace: TraceResponse) => string
}

const COLUMNS: readonly TraceColumn[] = [
  { column: 'id', label: 'ID de traza', numeric: false, format: (trace) => trace.id },
  {
    column: 'timestamp',
    label: 'Fecha',
    numeric: false,
    format: (trace) => formatDateTime(trace.timestamp),
  },
  {
    column: 'latency',
    label: 'Latencia',
    numeric: true,
    format: (trace) => formatLatency(trace.latency),
  },
  { column: 'cost', label: 'Coste', numeric: true, format: (trace) => formatCost(trace.cost) },
  {
    column: 'input_tokens',
    label: 'Tokens entrada',
    numeric: true,
    format: (trace) => formatInteger(trace.input_tokens),
  },
  {
    column: 'output_tokens',
    label: 'Tokens salida',
    numeric: true,
    format: (trace) => formatInteger(trace.output_tokens),
  },
  {
    column: 'total_tokens',
    label: 'Tokens totales',
    numeric: true,
    format: (trace) => formatInteger(trace.total_tokens),
  },
]

const SKELETON_ROWS = 5

function ariaSort(sort: TraceSort, column: TraceSortColumn) {
  if (sort.column !== column) {
    return 'none'
  }
  return sort.direction === 'asc' ? 'ascending' : 'descending'
}

function SortIcon({ sort, column }: { sort: TraceSort; column: TraceSortColumn }) {
  if (sort.column !== column) {
    return <ArrowUpDownIcon aria-hidden className="opacity-40" />
  }
  return sort.direction === 'asc' ? <ArrowUpIcon aria-hidden /> : <ArrowDownIcon aria-hidden />
}

function TracesTableHeader() {
  const sort = useTraceFiltersStore((state) => state.sort)
  const toggleSort = useTraceFiltersStore((state) => state.toggleSort)

  return (
    <TableHeader>
      <TableRow>
        {COLUMNS.map(({ column, label, numeric }) => (
          <TableHead
            key={column}
            aria-sort={ariaSort(sort, column)}
            className={cn(numeric && 'text-right')}
          >
            <Button
              variant="ghost"
              size="sm"
              className="-mx-3"
              onClick={() => {
                toggleSort(column)
              }}
            >
              {label}
              <SortIcon sort={sort} column={column} />
            </Button>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  )
}

interface TracesTableProps {
  traces: readonly TraceResponse[]
}

/** Traces of the range, sortable by any column. */
export function TracesTable({ traces }: TracesTableProps) {
  const sort = useTraceFiltersStore((state) => state.sort)
  const sortedTraces = useMemo(() => sortTraces(traces, sort), [traces, sort])

  return (
    <Table>
      <TracesTableHeader />
      <TableBody>
        {sortedTraces.map((trace) => (
          <TableRow key={trace.id}>
            {COLUMNS.map(({ column, numeric, format }) => (
              <TableCell
                key={column}
                className={cn(
                  numeric && 'text-right tabular-nums',
                  column === 'id' && 'max-w-48 truncate font-mono text-xs',
                )}
                title={column === 'id' ? trace.id : undefined}
              >
                {format(trace)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

/** Placeholder rows shown while the traces load. */
export function TracesTableSkeleton() {
  return (
    <Table>
      <TracesTableHeader />
      <TableBody>
        {Array.from({ length: SKELETON_ROWS }, (_, row) => (
          <TableRow key={row} data-testid="traces-skeleton-row">
            {COLUMNS.map(({ column }) => (
              <TableCell key={column}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
