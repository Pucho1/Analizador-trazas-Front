import type { TimeRange } from '@/api/types'

/** Query keys of the traces feature, so caching and invalidation stay consistent. */
export const traceKeys = {
  all: ['traces'] as const,
  list: (range: TimeRange) => [...traceKeys.all, 'list', range] as const,
  summary: (range: TimeRange) => [...traceKeys.all, 'summary', range] as const,
}
