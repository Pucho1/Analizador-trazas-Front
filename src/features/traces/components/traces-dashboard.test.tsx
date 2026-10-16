import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/api/api-error'
import { createQueryClient } from '@/app/query-client'
import { summaryFixture, traceListFixture } from '@/test/fixtures/traces'

import { getTraceSummary, getTraces } from '../services/traces-service'
import { useTraceFiltersStore } from '../store/trace-filters-store'
import { TracesDashboard } from './traces-dashboard'

vi.mock('../services/traces-service')

function renderDashboard() {
  const queryClient = createQueryClient()
  // Retries are covered by the query client tests; here they would only slow errors down.
  queryClient.setDefaultOptions({
    queries: { ...queryClient.getDefaultOptions().queries, retry: false },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <TracesDashboard />
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  useTraceFiltersStore.setState(useTraceFiltersStore.getInitialState(), true)
  vi.mocked(getTraces).mockResolvedValue(traceListFixture)
  vi.mocked(getTraceSummary).mockResolvedValue(summaryFixture)
})

describe('TracesDashboard', () => {
  it('shows skeletons while loading', () => {
    vi.mocked(getTraces).mockReturnValue(new Promise(() => undefined))
    vi.mocked(getTraceSummary).mockReturnValue(new Promise(() => undefined))

    renderDashboard()

    expect(screen.getAllByTestId('summary-skeleton')).toHaveLength(4)
    expect(screen.getAllByTestId('traces-skeleton-row').length).toBeGreaterThan(0)
  })

  it('shows the summary and the traces of the range', async () => {
    renderDashboard()

    expect(await screen.findByRole('cell', { name: 'trace-1' })).toBeInTheDocument()
    expect(screen.queryAllByTestId('summary-skeleton')).toHaveLength(0)
    expect(getTraces).toHaveBeenCalledWith('24h')
    expect(getTraceSummary).toHaveBeenCalledWith('24h')
  })

  it('shows the empty state when the range has no traces', async () => {
    vi.mocked(getTraces).mockResolvedValue({ time_range: '24h', traces: [] })
    vi.mocked(getTraceSummary).mockResolvedValue({
      ...summaryFixture,
      trace_count: 0,
      total_cost: 0,
      total_tokens: 0,
      average_latency: null,
    })

    renderDashboard()

    expect(await screen.findByText('No hay trazas')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('shows a single error when the Langfuse keys are wrong', async () => {
    const error = new ApiError('auth', 'Rejected', { status: 502 })
    vi.mocked(getTraces).mockRejectedValue(error)
    vi.mocked(getTraceSummary).mockRejectedValue(error)

    renderDashboard()

    expect(await screen.findByRole('alert')).toHaveTextContent('Claves de Langfuse incorrectas')
    expect(screen.getAllByRole('alert')).toHaveLength(1)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('recovers from an error when retrying', async () => {
    const user = userEvent.setup()
    vi.mocked(getTraces).mockRejectedValueOnce(new ApiError('source_unavailable', 'Down'))

    renderDashboard()
    await user.click(await screen.findByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByRole('cell', { name: 'trace-1' })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('loads the data of the range chosen in the selector', async () => {
    const user = userEvent.setup()
    renderDashboard()
    await screen.findByRole('cell', { name: 'trace-1' })

    await user.click(screen.getByRole('combobox', { name: 'Rango de fechas' }))
    await user.click(screen.getByRole('option', { name: 'Últimos 30 días' }))

    expect(getTraces).toHaveBeenLastCalledWith('30d')
    expect(getTraceSummary).toHaveBeenLastCalledWith('30d')
  })
})
