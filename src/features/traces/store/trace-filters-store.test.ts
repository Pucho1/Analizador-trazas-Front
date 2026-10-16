import { beforeEach, describe, expect, it } from 'vitest'

import { DEFAULT_TIME_RANGE } from '@/config/constants'

import { useTraceFiltersStore } from './trace-filters-store'

beforeEach(() => {
  useTraceFiltersStore.setState(useTraceFiltersStore.getInitialState(), true)
})

describe('useTraceFiltersStore', () => {
  it('starts on the default time range', () => {
    expect(useTraceFiltersStore.getState().timeRange).toBe(DEFAULT_TIME_RANGE)
  })

  it('changes the time range', () => {
    useTraceFiltersStore.getState().setTimeRange('30d')

    expect(useTraceFiltersStore.getState().timeRange).toBe('30d')
  })
})
