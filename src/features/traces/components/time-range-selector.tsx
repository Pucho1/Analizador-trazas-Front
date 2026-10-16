import type { TimeRange } from '@/api/types'
import { TIME_RANGE_LABELS } from '@/config/constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

import { useTraceFiltersStore } from '../store/trace-filters-store'

function isTimeRange(value: string): value is TimeRange {
  return Object.hasOwn(TIME_RANGE_LABELS, value)
}

/** Chooses the time range shown by the whole screen. */
export function TimeRangeSelector() {
  const timeRange = useTraceFiltersStore((state) => state.timeRange)
  const setTimeRange = useTraceFiltersStore((state) => state.setTimeRange)

  return (
    <Select
      value={timeRange}
      onValueChange={(value) => {
        if (isTimeRange(value)) {
          setTimeRange(value)
        }
      }}
    >
      <SelectTrigger aria-label="Rango de fechas" className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(TIME_RANGE_LABELS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
