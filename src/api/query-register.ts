import type { ApiError } from './api-error'

// Every query error comes through the HTTP client, so TanStack Query types it as `ApiError`.
declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError
  }
}
