import type { TraceResponse } from '@/api/types'

/** Trace fields the table can be sorted by. */
export type TraceSortColumn = Extract<
  keyof TraceResponse,
  'id' | 'timestamp' | 'latency' | 'cost' | 'input_tokens' | 'output_tokens' | 'total_tokens'
>

export type SortDirection = 'asc' | 'desc'

export interface TraceSort {
  column: TraceSortColumn
  direction: SortDirection
}

/** Most recent first, the same order in which the backend returns traces. */
export const DEFAULT_TRACE_SORT: TraceSort = { column: 'timestamp', direction: 'desc' }

type SortValue = string | number | null

function sortValue(trace: TraceResponse, column: TraceSortColumn): SortValue {
  // Timestamps may carry different UTC offsets, so they are compared as instants.
  return column === 'timestamp' ? Date.parse(trace.timestamp) : trace[column]
}

function compareValues(a: SortValue, b: SortValue): number {
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b)
  }
  return Number(a) - Number(b)
}

/**
 * Returns a new array with the traces in the requested order. Missing values (a latency still
 * in progress) always go last, whatever the direction.
 */
export function sortTraces(traces: readonly TraceResponse[], sort: TraceSort): TraceResponse[] {
  const sign = sort.direction === 'asc' ? 1 : -1

  return traces.toSorted((first, second) => {
    const a = sortValue(first, sort.column)
    const b = sortValue(second, sort.column)
    if (a === null || b === null) {
      return Number(a === null) - Number(b === null)
    }
    return sign * compareValues(a, b)
  })
}
