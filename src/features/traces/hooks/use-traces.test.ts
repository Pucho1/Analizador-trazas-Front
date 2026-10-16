import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/api/api-error'
import type { TimeRange } from '@/api/types'
import { traceListFixture } from '@/test/fixtures/traces'
import { createQueryWrapper } from '@/test/query-wrapper'

import { getTraces } from '../services/traces-service'
import { useTraces } from './use-traces'

vi.mock('../services/traces-service')

function renderUseTraces(initialRange: TimeRange = '24h') {
  return renderHook(({ range }) => useTraces(range), {
    initialProps: { range: initialRange },
    wrapper: createQueryWrapper(),
  })
}

describe('useTraces', () => {
  it('returns the traces of the range', async () => {
    vi.mocked(getTraces).mockResolvedValue(traceListFixture)

    const { result } = renderUseTraces()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toEqual(traceListFixture)
    expect(getTraces).toHaveBeenCalledWith('24h')
  })

  it('returns an empty list when the range has no traces', async () => {
    vi.mocked(getTraces).mockResolvedValue({ time_range: '24h', traces: [] })

    const { result } = renderUseTraces()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data?.traces).toEqual([])
  })

  it('exposes an auth error without retrying', async () => {
    const error = new ApiError('auth', 'Rejected', { status: 502 })
    vi.mocked(getTraces).mockRejectedValue(error)

    const { result } = renderUseTraces()

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(result.current.error).toBe(error)
    expect(getTraces).toHaveBeenCalledTimes(1)
  })

  it('fetches the new range when it changes', async () => {
    vi.mocked(getTraces).mockImplementation((range) =>
      Promise.resolve({ ...traceListFixture, time_range: range }),
    )

    const { result, rerender } = renderUseTraces('24h')
    await waitFor(() => {
      expect(result.current.data?.time_range).toBe('24h')
    })

    rerender({ range: '7d' })

    await waitFor(() => {
      expect(result.current.data?.time_range).toBe('7d')
    })
    expect(getTraces).toHaveBeenLastCalledWith('7d')
  })
})
