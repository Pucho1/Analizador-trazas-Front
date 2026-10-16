import { create } from 'zustand'

import type { TimeRange } from '@/api/types'
import { DEFAULT_TIME_RANGE } from '@/config/constants'

interface TraceFiltersState {
  timeRange: TimeRange
  setTimeRange: (timeRange: TimeRange) => void
}

/** Interface-only filters of the traces screen (server data lives in TanStack Query). */
export const useTraceFiltersStore = create<TraceFiltersState>()((set) => ({
  timeRange: DEFAULT_TIME_RANGE,
  setTimeRange: (timeRange) => {
    set({ timeRange })
  },
}))
