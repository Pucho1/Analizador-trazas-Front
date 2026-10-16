import { useQueryClient } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { QUERY_STALE_TIME_MS } from '@/config/constants'

import { AppProviders } from './providers'

function StaleTimeProbe() {
  const staleTime = useQueryClient().getDefaultOptions().queries?.staleTime

  return <p>{String(staleTime)}</p>
}

describe('AppProviders', () => {
  it('provides the configured QueryClient to its children', () => {
    render(
      <AppProviders>
        <StaleTimeProbe />
      </AppProviders>,
    )

    expect(screen.getByText(String(QUERY_STALE_TIME_MS))).toBeInTheDocument()
  })
})
