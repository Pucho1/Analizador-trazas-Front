import { beforeEach, describe, expect, it } from 'vitest'

import { DEFAULT_TIME_RANGE } from '@/config/constants'

import { DEFAULT_TRACE_SORT } from '../utils/sort-traces'
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

  it('starts on the default sort', () => {
    expect(useTraceFiltersStore.getState().sort).toEqual(DEFAULT_TRACE_SORT)
  })

  it('sorts a new column in descending order', () => {
    useTraceFiltersStore.getState().toggleSort('cost')

    expect(useTraceFiltersStore.getState().sort).toEqual({ column: 'cost', direction: 'desc' })
  })

  it('flips the direction when the same column is toggled again', () => {
    const { toggleSort } = useTraceFiltersStore.getState()

    toggleSort('cost')
    toggleSort('cost')

    expect(useTraceFiltersStore.getState().sort).toEqual({ column: 'cost', direction: 'asc' })
  })
})
