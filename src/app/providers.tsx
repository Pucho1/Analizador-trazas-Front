import { QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

import { createQueryClient } from './query-client'

interface AppProvidersProps {
  children: ReactNode
}

/** Global providers shared by the whole application. */
export function AppProviders({ children }: AppProvidersProps) {
  // One client per mounted app, kept stable across renders.
  const [queryClient] = useState(createQueryClient)

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
