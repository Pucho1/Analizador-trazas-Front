import axios from 'axios'

import { API_V1_PREFIX, HTTP_TIMEOUT_MS } from '@/config/constants'
import { env } from '@/config/env'

import { toApiError } from './api-error'

/** Single Axios instance for the Observa API. Failed requests reject with `ApiError`. */
export const httpClient = axios.create({
  baseURL: `${env.VITE_API_BASE_URL}${API_V1_PREFIX}`,
  timeout: HTTP_TIMEOUT_MS,
})

httpClient.interceptors.response.use(undefined, (error: unknown) =>
  Promise.reject(toApiError(error)),
)
