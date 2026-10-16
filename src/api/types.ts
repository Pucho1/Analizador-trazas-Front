import type { components, paths } from './generated/schema'

// Readable aliases over the types generated from the backend OpenAPI.
type Schemas = components['schemas']

export type TimeRange = Schemas['TimeRange']
export type TraceResponse = Schemas['TraceResponse']
export type TraceListResponse = Schemas['TraceListResponse']
export type SummaryResponse = Schemas['SummaryResponse']
export type ErrorCode = Schemas['ErrorCode']
export type ErrorResponse = Schemas['ErrorResponse']

export type TracesQuery = NonNullable<paths['/api/v1/traces']['get']['parameters']['query']>
export type TraceSummaryQuery = NonNullable<
  paths['/api/v1/traces/summary']['get']['parameters']['query']
>
