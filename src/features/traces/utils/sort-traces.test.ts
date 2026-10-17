import { describe, expect, it } from 'vitest'

import type { TraceResponse } from '@/api/types'
import { traceFixture } from '@/test/fixtures/traces'

import { sortTraces } from './sort-traces'

function trace(overrides: Partial<TraceResponse>): TraceResponse {
  return { ...traceFixture, ...overrides }
}

const traces = [
  trace({ id: 'b', timestamp: '2026-10-16T10:00:00+00:00', latency: 2, cost: 0.5 }),
  trace({ id: 'a', timestamp: '2026-10-16T13:00:00+02:00', latency: null, cost: 0.1 }),
  trace({ id: 'c', timestamp: '2026-10-16T09:00:00+00:00', latency: 1, cost: 0.9 }),
]

function ids(sorted: readonly TraceResponse[]): string[] {
  return sorted.map(({ id }) => id)
}

describe('sortTraces', () => {
  it('sorts numbers in both directions', () => {
    expect(ids(sortTraces(traces, { column: 'cost', direction: 'asc' }))).toEqual(['a', 'b', 'c'])
    expect(ids(sortTraces(traces, { column: 'cost', direction: 'desc' }))).toEqual(['c', 'b', 'a'])
  })

  it('sorts text alphabetically', () => {
    expect(ids(sortTraces(traces, { column: 'id', direction: 'asc' }))).toEqual(['a', 'b', 'c'])
  })

  it('compares timestamps as instants, whatever their offset', () => {
    // 'a' is 11:00 UTC, the latest of the three.
    expect(ids(sortTraces(traces, { column: 'timestamp', direction: 'desc' }))).toEqual([
      'a',
      'b',
      'c',
    ])
  })

  it('puts missing latencies last in both directions', () => {
    expect(ids(sortTraces(traces, { column: 'latency', direction: 'asc' }))).toEqual([
      'c',
      'b',
      'a',
    ])
    expect(ids(sortTraces(traces, { column: 'latency', direction: 'desc' }))).toEqual([
      'b',
      'c',
      'a',
    ])
  })

  it('does not modify the given array', () => {
    const original = [...traces]

    sortTraces(traces, { column: 'cost', direction: 'asc' })

    expect(traces).toEqual(original)
  })
})
