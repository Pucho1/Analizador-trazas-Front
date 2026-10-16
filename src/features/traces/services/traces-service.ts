import { httpClient } from '@/api/http-client'
import type {
  SummaryResponse,
  TimeRange,
  TraceListResponse,
  TraceSummaryQuery,
  TracesQuery,
} from '@/api/types'
import { API_PATHS } from '@/config/constants'

/** Traces in the range, most recent first. Rejects with `ApiError`. */
export async function getTraces(range: TimeRange): Promise<TraceListResponse> {
  const params: TracesQuery = { range }
  const { data } = await httpClient.get<TraceListResponse>(API_PATHS.traces, { params })
  return data
}

/** Aggregated metrics over the range, as computed by the backend. Rejects with `ApiError`. */
export async function getTraceSummary(range: TimeRange): Promise<SummaryResponse> {
  const params: TraceSummaryQuery = { range }
  const { data } = await httpClient.get<SummaryResponse>(API_PATHS.traceSummary, { params })
  return data
}
