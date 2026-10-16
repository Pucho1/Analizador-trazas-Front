import { QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'

import { createQueryClient } from '@/app/query-client'

/** Wraps hooks under test in a fresh QueryClient with the app's defaults. */
export function createQueryWrapper() {
  const queryClient = createQueryClient()

  return function QueryWrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}
