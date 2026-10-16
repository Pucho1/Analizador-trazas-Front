import { useQuery, type UseQueryResult } from '@tanstack/react-query'

import type { TimeRange, TraceListResponse } from '@/api/types'

import { getTraces } from '../services/traces-service'
import { traceKeys } from './query-keys'

/** Traces of the range; changing the range fetches (or reads from cache) that range. */
export function useTraces(range: TimeRange): UseQueryResult<TraceListResponse> {
  return useQuery({
    queryKey: traceKeys.list(range),
    queryFn: () => getTraces(range),
  })
}
