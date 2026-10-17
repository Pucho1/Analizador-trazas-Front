import { COST_CURRENCY, DISPLAY_LOCALE, MISSING_VALUE } from '@/config/constants'

// Formatters only present values computed by the backend; they never aggregate anything.

const costFormatter = new Intl.NumberFormat(DISPLAY_LOCALE, {
  style: 'currency',
  currency: COST_CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
})

const integerFormatter = new Intl.NumberFormat(DISPLAY_LOCALE, { maximumFractionDigits: 0 })

const millisecondsFormatter = new Intl.NumberFormat(DISPLAY_LOCALE, {
  style: 'unit',
  unit: 'millisecond',
  maximumFractionDigits: 0,
})

const secondsFormatter = new Intl.NumberFormat(DISPLAY_LOCALE, {
  style: 'unit',
  unit: 'second',
  maximumFractionDigits: 2,
})

const dateTimeFormatter = new Intl.DateTimeFormat(DISPLAY_LOCALE, {
  dateStyle: 'short',
  timeStyle: 'medium',
})

/** Cost in USD, keeping enough decimals for the small amounts of a single trace. */
export function formatCost(cost: number): string {
  return costFormatter.format(cost)
}

/** Whole quantities such as token or trace counts, with thousands separators. */
export function formatInteger(value: number): string {
  return integerFormatter.format(value)
}

/** Latency given in seconds: below one second it is shown in milliseconds. */
export function formatLatency(seconds: number | null): string {
  if (seconds === null) {
    return MISSING_VALUE
  }
  return seconds < 1
    ? millisecondsFormatter.format(seconds * 1000)
    : secondsFormatter.format(seconds)
}

/** ISO 8601 timestamp shown in the browser's local time zone. */
export function formatDateTime(isoTimestamp: string): string {
  return dateTimeFormatter.format(new Date(isoTimestamp))
}
