import { isAxiosError } from 'axios'

import type { ErrorCode, ErrorResponse } from './types'

/**
 * What went wrong, as far as the interface needs to know:
 * - `auth`: the backend rejected its trace source credentials (wrong Langfuse keys).
 * - `source_unavailable`: the trace source failed for any other reason.
 * - `network`: the backend could not be reached (offline, timeout, CORS).
 * - `unknown`: any other unexpected response.
 */
export type ApiErrorKind = 'auth' | 'source_unavailable' | 'network' | 'unknown'

// `satisfies` makes the typecheck fail if the backend adds an error code not handled here.
const KIND_BY_CODE = {
  trace_source_auth_failed: 'auth',
  trace_source_unavailable: 'source_unavailable',
} as const satisfies Record<ErrorCode, ApiErrorKind>

interface ApiErrorOptions {
  status?: number
  cause?: unknown
}

/** Every failed request to the Observa API is rejected with this error. */
export class ApiError extends Error {
  override readonly name = 'ApiError'
  readonly kind: ApiErrorKind
  /** HTTP status of the response, when there was one. */
  readonly status: number | undefined

  constructor(kind: ApiErrorKind, message: string, { status, cause }: ApiErrorOptions = {}) {
    super(message, { cause })
    this.kind = kind
    this.status = status
  }
}

function isErrorResponse(data: unknown): data is ErrorResponse {
  if (typeof data !== 'object' || data === null || !('error' in data)) {
    return false
  }
  const { error } = data
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string' &&
    Object.hasOwn(KIND_BY_CODE, error.code) &&
    'message' in error &&
    typeof error.message === 'string'
  )
}

/** Normalises anything thrown while calling the API into an `ApiError`. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }
  if (!isAxiosError(error)) {
    return new ApiError('unknown', 'Unexpected error while calling the Observa API', {
      cause: error,
    })
  }
  const { response } = error
  if (!response) {
    return new ApiError('network', 'Could not reach the Observa API', { cause: error })
  }
  if (isErrorResponse(response.data)) {
    const { code, message } = response.data.error
    return new ApiError(KIND_BY_CODE[code], message, { status: response.status, cause: error })
  }
  return new ApiError(
    'unknown',
    `Unexpected response from the Observa API (HTTP ${String(response.status)})`,
    { status: response.status, cause: error },
  )
}
