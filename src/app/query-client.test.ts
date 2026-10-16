import { describe, expect, it } from 'vitest'

import { ApiError, type ApiErrorKind } from '@/api/api-error'
import { QUERY_MAX_RETRIES, QUERY_STALE_TIME_MS } from '@/config/constants'

import { createQueryClient, shouldRetry } from './query-client'

describe('shouldRetry', () => {
  it('never retries rejected credentials', () => {
    expect(shouldRetry(0, new ApiError('auth', 'Rejected'))).toBe(false)
  })

  it.each<ApiErrorKind>(['source_unavailable', 'network', 'unknown'])(
    'retries a %s error up to the maximum',
    (kind) => {
      const error = new ApiError(kind, 'Failed')

      expect(shouldRetry(QUERY_MAX_RETRIES - 1, error)).toBe(true)
      expect(shouldRetry(QUERY_MAX_RETRIES, error)).toBe(false)
    },
  )
})

describe('createQueryClient', () => {
  it('applies the shared query defaults', () => {
    const { queries } = createQueryClient().getDefaultOptions()

    expect(queries?.staleTime).toBe(QUERY_STALE_TIME_MS)
    expect(queries?.retry).toBe(shouldRetry)
  })
})
