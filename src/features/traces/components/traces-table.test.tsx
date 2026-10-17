import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import type { TraceResponse } from '@/api/types'
import { formatCost, formatDateTime, formatLatency } from '@/shared/utils/format'
import { traceFixture } from '@/test/fixtures/traces'

import { useTraceFiltersStore } from '../store/trace-filters-store'
import { TracesTable } from './traces-table'

const traces: TraceResponse[] = [
  { ...traceFixture, id: 'recent', timestamp: '2026-10-16T10:00:00+00:00', cost: 0.2 },
  { ...traceFixture, id: 'old', timestamp: '2026-10-15T10:00:00+00:00', cost: 0.9 },
]

beforeEach(() => {
  useTraceFiltersStore.setState(useTraceFiltersStore.getInitialState(), true)
})

function rowIds(): string[] {
  const [, ...bodyRows] = screen.getAllByRole('row')
  return bodyRows.map((row) => within(row).getAllByRole('cell')[0]?.textContent ?? '')
}

describe('TracesTable', () => {
  it('shows every column of a trace formatted', () => {
    render(<TracesTable traces={[traceFixture]} />)

    const [, row] = screen.getAllByRole('row')
    if (!row) throw new Error('Missing trace row')
    const cells = within(row)
      .getAllByRole('cell')
      .map((cell) => cell.textContent)
    expect(cells).toEqual([
      traceFixture.id,
      formatDateTime(traceFixture.timestamp),
      formatLatency(traceFixture.latency),
      formatCost(traceFixture.cost),
      '120',
      '80',
      '200',
    ])
  })

  it('starts sorted by date, most recent first', () => {
    render(<TracesTable traces={traces} />)

    expect(rowIds()).toEqual(['recent', 'old'])
    expect(screen.getByRole('columnheader', { name: /Fecha/ })).toHaveAttribute(
      'aria-sort',
      'descending',
    )
  })

  it('sorts by a column when its header is clicked, and flips on a second click', async () => {
    const user = userEvent.setup()
    render(<TracesTable traces={traces} />)
    const costHeader = screen.getByRole('columnheader', { name: /Coste/ })

    await user.click(within(costHeader).getByRole('button'))
    expect(rowIds()).toEqual(['old', 'recent'])
    expect(costHeader).toHaveAttribute('aria-sort', 'descending')

    await user.click(within(costHeader).getByRole('button'))
    expect(rowIds()).toEqual(['recent', 'old'])
    expect(costHeader).toHaveAttribute('aria-sort', 'ascending')
  })
})
