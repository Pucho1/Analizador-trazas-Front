import MockAdapter from 'axios-mock-adapter'
import { afterEach, describe, expect, it } from 'vitest'

import { ApiError, toApiError } from './api-error'
import { httpClient } from './http-client'

const mock = new MockAdapter(httpClient)

afterEach(() => {
  mock.reset()
})

async function captureError(): Promise<unknown> {
  try {
    await httpClient.get('/anything')
  } catch (error) {
    return error
  }
  throw new Error('Expected the request to fail')
}

describe('httpClient', () => {
  it('targets version 1 of the configured backend', () => {
    expect(httpClient.defaults.baseURL).toBe('http://api.test/api/v1')
  })

  it('maps rejected trace source credentials to an auth error', async () => {
    mock.onGet('/anything').reply(502, {
      error: { code: 'trace_source_auth_failed', message: 'Langfuse rejected the credentials' },
    })

    const error = await captureError()

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({
      kind: 'auth',
      status: 502,
      message: 'Langfuse rejected the credentials',
    })
  })

  it('maps any other trace source failure to source_unavailable', async () => {
    mock.onGet('/anything').reply(502, {
      error: { code: 'trace_source_unavailable', message: 'Langfuse is down' },
    })

    expect(await captureError()).toMatchObject({ kind: 'source_unavailable', status: 502 })
  })

  it('maps a request without response to a network error', async () => {
    mock.onGet('/anything').networkError()

    expect(await captureError()).toMatchObject({ kind: 'network', status: undefined })
  })

  it('maps a timeout to a network error', async () => {
    mock.onGet('/anything').timeout()

    expect(await captureError()).toMatchObject({ kind: 'network' })
  })

  it.each([
    ['a body that is not an ErrorResponse', 500, 'Internal Server Error'],
    ['an unknown error code', 502, { error: { code: 'new_code', message: 'New' } }],
    ['a validation error', 422, { detail: [] }],
  ])('maps %s to an unknown error', async (_, status, body) => {
    mock.onGet('/anything').reply(status, body)

    expect(await captureError()).toMatchObject({ kind: 'unknown', status })
  })
})

describe('toApiError', () => {
  it('returns an ApiError unchanged', () => {
    const error = new ApiError('auth', 'Rejected')

    expect(toApiError(error)).toBe(error)
  })

  it('wraps a non-Axios error as unknown, keeping it as the cause', () => {
    const cause = new TypeError('boom')

    expect(toApiError(cause)).toMatchObject({ kind: 'unknown', cause })
  })
})
