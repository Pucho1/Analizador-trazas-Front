import type { TimeRange } from '@/api/types'

/** Path prefix of version 1 of the Observa API. */
export const API_V1_PREFIX = '/api/v1'

/** Endpoint paths, relative to `API_V1_PREFIX`. */
export const API_PATHS = {
  traces: '/traces',
  traceSummary: '/traces/summary',
} as const

export const HTTP_TIMEOUT_MS = 15_000

/** How long fetched data is considered fresh before TanStack Query refetches it. */
export const QUERY_STALE_TIME_MS = 60_000

/** Maximum retries of a failed query (errors that cannot recover are never retried). */
export const QUERY_MAX_RETRIES = 2

export const DEFAULT_TIME_RANGE: TimeRange = '24h'

/** Labels of the time range selector, in display order. */
export const TIME_RANGE_LABELS = {
  '24h': 'Últimas 24 horas',
  '7d': 'Últimos 7 días',
  '30d': 'Últimos 30 días',
} as const satisfies Record<TimeRange, string>

/** Locale used to format numbers and dates shown in the interface. */
export const DISPLAY_LOCALE = 'es-ES'

/** Currency in which the backend reports costs. */
export const COST_CURRENCY = 'USD'

/** Placeholder shown when a value is missing (e.g. latency of a trace still in progress). */
export const MISSING_VALUE = '—'
