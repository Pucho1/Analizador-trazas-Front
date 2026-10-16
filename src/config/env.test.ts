import { describe, expect, it } from 'vitest'

import { parseEnv } from './env'

describe('parseEnv', () => {
  it('accepts an http(s) backend URL', () => {
    expect(parseEnv({ VITE_API_BASE_URL: 'https://observa.example.com' })).toEqual({
      VITE_API_BASE_URL: 'https://observa.example.com',
    })
  })

  it('removes trailing slashes so paths can be appended safely', () => {
    expect(parseEnv({ VITE_API_BASE_URL: 'http://127.0.0.1:8000//' }).VITE_API_BASE_URL).toBe(
      'http://127.0.0.1:8000',
    )
  })

  it.each([
    ['missing', {}],
    ['empty', { VITE_API_BASE_URL: '' }],
    ['not a URL', { VITE_API_BASE_URL: 'observa' }],
    ['not http(s)', { VITE_API_BASE_URL: 'ftp://observa.example.com' }],
  ])('rejects a %s VITE_API_BASE_URL', (_, raw) => {
    expect(() => parseEnv(raw)).toThrow(/Invalid environment configuration[\s\S]*VITE_API_BASE_URL/)
  })
})
