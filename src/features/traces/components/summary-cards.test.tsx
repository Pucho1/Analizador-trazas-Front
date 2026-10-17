import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { formatCost, formatInteger, formatLatency } from '@/shared/utils/format'
import { summaryFixture } from '@/test/fixtures/traces'
import { plainSpaces } from '@/test/text'

import { SummaryCards } from './summary-cards'

describe('SummaryCards', () => {
  it('shows the four metrics formatted', () => {
    render(<SummaryCards summary={{ ...summaryFixture, trace_count: 1500, total_tokens: 25000 }} />)

    expect(screen.getByText('Trazas')).toBeInTheDocument()
    expect(screen.getByText(formatInteger(1500))).toBeInTheDocument()
    expect(screen.getByText(plainSpaces(formatCost(summaryFixture.total_cost)))).toBeInTheDocument()
    expect(screen.getByText(formatInteger(25000))).toBeInTheDocument()
    expect(
      screen.getByText(plainSpaces(formatLatency(summaryFixture.average_latency))),
    ).toBeInTheDocument()
  })

  it('shows a placeholder when no trace reports a latency', () => {
    render(<SummaryCards summary={{ ...summaryFixture, average_latency: null }} />)

    expect(screen.getByText(formatLatency(null))).toBeInTheDocument()
  })

  it('shows skeletons while loading', () => {
    render(<SummaryCards summary={undefined} />)

    expect(screen.getAllByTestId('summary-skeleton')).toHaveLength(4)
  })
})
