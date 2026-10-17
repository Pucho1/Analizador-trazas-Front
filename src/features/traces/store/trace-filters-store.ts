import { create } from 'zustand'

import type { TimeRange } from '@/api/types'
import { DEFAULT_TIME_RANGE } from '@/config/constants'

import { DEFAULT_TRACE_SORT, type TraceSort, type TraceSortColumn } from '../utils/sort-traces'

interface TraceFiltersState {
  timeRange: TimeRange
  sort: TraceSort
  setTimeRange: (timeRange: TimeRange) => void
  /** Same column flips the direction; a new column starts descending (largest first). */
  toggleSort: (column: TraceSortColumn) => void
}

/** Interface-only filters of the traces screen (server data lives in TanStack Query). */
export const useTraceFiltersStore = create<TraceFiltersState>()((set) => ({
  timeRange: DEFAULT_TIME_RANGE,
  sort: DEFAULT_TRACE_SORT,
  setTimeRange: (timeRange) => {
    set({ timeRange })
  },
  toggleSort: (column) => {
    set(({ sort }) => ({
      sort:
        sort.column === column
          ? { column, direction: sort.direction === 'asc' ? 'desc' : 'asc' }
          : { column, direction: 'desc' },
    }))
  },
}))
