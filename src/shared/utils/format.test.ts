import { describe, expect, it } from 'vitest'

import { MISSING_VALUE } from '@/config/constants'
import { plainSpaces as plain } from '@/test/text'

import { formatCost, formatDateTime, formatInteger, formatLatency } from './format'

describe('formatCost', () => {
  it('keeps up to four decimals for small amounts', () => {
    expect(plain(formatCost(0.0042))).toBe('0,0042 US$')
  })

  it('shows at least two decimals', () => {
    expect(plain(formatCost(12.5))).toBe('12,50 US$')
  })
})

describe('formatInteger', () => {
  it('adds thousands separators', () => {
    expect(formatInteger(12345)).toBe('12.345')
  })
})

describe('formatLatency', () => {
  it('shows sub-second latencies in milliseconds', () => {
    expect(plain(formatLatency(0.25))).toBe('250 ms')
  })

  it('shows longer latencies in seconds', () => {
    expect(plain(formatLatency(1.25))).toBe('1,25 s')
  })

  it('shows a placeholder when there is no latency', () => {
    expect(formatLatency(null)).toBe(MISSING_VALUE)
  })
})

describe('formatDateTime', () => {
  it('formats the instant in local time', () => {
    expect(formatDateTime('2026-10-16T12:00:00+02:00')).toBe('16/10/26, 10:00:00')
  })
})
