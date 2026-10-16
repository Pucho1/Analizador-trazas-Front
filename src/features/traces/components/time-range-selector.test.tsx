import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { useTraceFiltersStore } from '../store/trace-filters-store'
import { TimeRangeSelector } from './time-range-selector'

beforeEach(() => {
  useTraceFiltersStore.setState(useTraceFiltersStore.getInitialState(), true)
})

describe('TimeRangeSelector', () => {
  it('shows the selected range', () => {
    render(<TimeRangeSelector />)

    expect(screen.getByRole('combobox', { name: 'Rango de fechas' })).toHaveTextContent(
      'Últimas 24 horas',
    )
  })

  it('changes the range of the screen', async () => {
    const user = userEvent.setup()
    render(<TimeRangeSelector />)

    await user.click(screen.getByRole('combobox', { name: 'Rango de fechas' }))
    await user.click(screen.getByRole('option', { name: 'Últimos 7 días' }))

    expect(useTraceFiltersStore.getState().timeRange).toBe('7d')
    expect(screen.getByRole('combobox', { name: 'Rango de fechas' })).toHaveTextContent(
      'Últimos 7 días',
    )
  })
})
