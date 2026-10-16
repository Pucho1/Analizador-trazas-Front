import { QueryClient } from '@tanstack/react-query'

import type { ApiError } from '@/api/api-error'
import { QUERY_MAX_RETRIES, QUERY_STALE_TIME_MS } from '@/config/constants'

/** Wrong credentials will not fix themselves, so only other failures are retried. */
export function shouldRetry(failureCount: number, error: ApiError): boolean {
  return error.kind !== 'auth' && failureCount < QUERY_MAX_RETRIES
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME_MS,
        retry: shouldRetry,
      },
    },
  })
}
