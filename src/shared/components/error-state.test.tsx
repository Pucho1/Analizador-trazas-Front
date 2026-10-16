import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ErrorState } from './error-state'

describe('ErrorState', () => {
  it('explains that the Langfuse keys are wrong', () => {
    render(<ErrorState kind="auth" onRetry={vi.fn()} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Claves de Langfuse incorrectas')
  })

  it('explains that the backend cannot be reached', () => {
    render(<ErrorState kind="network" onRetry={vi.fn()} />)

    expect(screen.getByRole('alert')).toHaveTextContent('No se puede conectar con el servidor')
  })

  it('retries when the button is clicked', async () => {
    const onRetry = vi.fn()
    render(<ErrorState kind="unknown" onRetry={onRetry} />)

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('disables the button while retrying', () => {
    render(<ErrorState kind="unknown" onRetry={vi.fn()} isRetrying />)

    expect(screen.getByRole('button', { name: 'Reintentando…' })).toBeDisabled()
  })
})
