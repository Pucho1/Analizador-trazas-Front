import type { SummaryResponse, TraceListResponse, TraceResponse } from '@/api/types'

export const traceFixture: TraceResponse = {
  id: 'trace-1',
  timestamp: '2026-10-16T10:00:00+00:00',
  name: 'support-agent',
  latency: 1.25,
  cost: 0.0042,
  input_tokens: 120,
  output_tokens: 80,
  total_tokens: 200,
}

export const traceListFixture: TraceListResponse = {
  time_range: '24h',
  traces: [traceFixture],
}

export const summaryFixture: SummaryResponse = {
  time_range: '24h',
  trace_count: 1,
  total_cost: 0.0042,
  total_tokens: 200,
  average_latency: 1.25,
}
