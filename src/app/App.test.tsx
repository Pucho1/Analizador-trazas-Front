import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { getTraceSummary, getTraces } from '@/features/traces/services/traces-service'
import { summaryFixture, traceListFixture } from '@/test/fixtures/traces'

import { App } from './App'
import { AppProviders } from './providers'

vi.mock('@/features/traces/services/traces-service')

describe('App', () => {
  it('renders the application title and the traces screen', async () => {
    vi.mocked(getTraces).mockResolvedValue(traceListFixture)
    vi.mocked(getTraceSummary).mockResolvedValue(summaryFixture)

    render(
      <AppProviders>
        <App />
      </AppProviders>,
    )

    expect(screen.getByRole('heading', { name: 'Observa' })).toBeInTheDocument()
    expect(await screen.findByRole('cell', { name: 'trace-1' })).toBeInTheDocument()
  })
})
