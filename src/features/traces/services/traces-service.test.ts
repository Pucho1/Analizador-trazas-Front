import MockAdapter from 'axios-mock-adapter'
import { afterEach, describe, expect, it } from 'vitest'

import { ApiError } from '@/api/api-error'
import { httpClient } from '@/api/http-client'
import { API_PATHS } from '@/config/constants'
import { summaryFixture, traceListFixture } from '@/test/fixtures/traces'

import { getTraceSummary, getTraces } from './traces-service'

const mock = new MockAdapter(httpClient)

afterEach(() => {
  mock.reset()
})

describe('getTraces', () => {
  it('requests the traces of the given range and returns them unchanged', async () => {
    const body = { ...traceListFixture, time_range: '7d' }
    mock.onGet(API_PATHS.traces, { params: { range: '7d' } }).reply(200, body)

    await expect(getTraces('7d')).resolves.toEqual(body)
  })

  it('rejects with an ApiError when the request fails', async () => {
    mock.onGet(API_PATHS.traces).reply(502, {
      error: { code: 'trace_source_auth_failed', message: 'Rejected' },
    })

    await expect(getTraces('24h')).rejects.toBeInstanceOf(ApiError)
  })
})

describe('getTraceSummary', () => {
  it('requests the summary of the given range and returns it unchanged', async () => {
    const body = { ...summaryFixture, time_range: '30d' }
    mock.onGet(API_PATHS.traceSummary, { params: { range: '30d' } }).reply(200, body)

    await expect(getTraceSummary('30d')).resolves.toEqual(body)
  })

  it('rejects with an ApiError when the request fails', async () => {
    mock.onGet(API_PATHS.traceSummary).networkError()

    await expect(getTraceSummary('24h')).rejects.toMatchObject({ kind: 'network' })
  })
})
