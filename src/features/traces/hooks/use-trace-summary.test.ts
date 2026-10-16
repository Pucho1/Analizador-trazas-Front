import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/api/api-error'
import { summaryFixture } from '@/test/fixtures/traces'
import { createQueryWrapper } from '@/test/query-wrapper'

import { getTraceSummary } from '../services/traces-service'
import { useTraceSummary } from './use-trace-summary'

vi.mock('../services/traces-service')

describe('useTraceSummary', () => {
  it('returns the summary computed by the backend', async () => {
    vi.mocked(getTraceSummary).mockResolvedValue(summaryFixture)

    const { result } = renderHook(() => useTraceSummary('30d'), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toEqual(summaryFixture)
    expect(getTraceSummary).toHaveBeenCalledWith('30d')
  })

  it('keeps a null average latency as returned', async () => {
    const empty = { ...summaryFixture, trace_count: 0, average_latency: null }
    vi.mocked(getTraceSummary).mockResolvedValue(empty)

    const { result } = renderHook(() => useTraceSummary('24h'), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data?.average_latency).toBeNull()
  })

  it('exposes an auth error without retrying', async () => {
    const error = new ApiError('auth', 'Rejected', { status: 502 })
    vi.mocked(getTraceSummary).mockRejectedValue(error)

    const { result } = renderHook(() => useTraceSummary('24h'), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(result.current.error?.kind).toBe('auth')
    expect(getTraceSummary).toHaveBeenCalledTimes(1)
  })
})
