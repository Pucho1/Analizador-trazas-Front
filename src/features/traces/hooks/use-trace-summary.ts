import { useQuery, type UseQueryResult } from '@tanstack/react-query'

import type { SummaryResponse, TimeRange } from '@/api/types'

import { getTraceSummary } from '../services/traces-service'
import { traceKeys } from './query-keys'

/** Summary metrics of the range, computed by the backend. */
export function useTraceSummary(range: TimeRange): UseQueryResult<SummaryResponse> {
  return useQuery({
    queryKey: traceKeys.summary(range),
    queryFn: () => getTraceSummary(range),
  })
}
