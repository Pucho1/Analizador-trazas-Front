import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z
    .url({
      protocol: /^https?$/,
      error: 'VITE_API_BASE_URL must be an http(s) URL, e.g. http://127.0.0.1:8000',
    })
    .transform((url) => url.replace(/\/+$/, '')),
})

/** Non-secret configuration read from `VITE_*` variables (they end up in the browser bundle). */
export type Env = z.infer<typeof envSchema>

/** Validates the raw environment, failing fast with a readable message when it is invalid. */
export function parseEnv(raw: Record<string, unknown>): Env {
  const result = envSchema.safeParse(raw)
  if (!result.success) {
    throw new Error(`Invalid environment configuration:\n${z.prettifyError(result.error)}`)
  }
  return result.data
}

export const env: Env = parseEnv(import.meta.env)
