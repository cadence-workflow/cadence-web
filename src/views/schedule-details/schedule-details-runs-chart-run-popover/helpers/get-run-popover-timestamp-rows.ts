import formatDate from '@/utils/data-formatters/format-date';
import { type ChartSeriesRun } from '@/views/schedule-details/schedule-details-runs-chart-series/schedule-details-runs-chart-series.types';

import {
  RUN_POPOVER_EMPTY_VALUE,
  RUN_POPOVER_TIMESTAMP_LABELS,
} from '../schedule-details-runs-chart-run-popover.constants';
import { type PopoverEntryRow } from '../schedule-details-runs-chart-run-popover.types';

function formatTimestamp(timestampMs: number | null): string {
  if (timestampMs == null) {
    return RUN_POPOVER_EMPTY_VALUE;
  }

  return formatDate(timestampMs);
}

export default function getRunPopoverTimestampRows(
  run: Pick<ChartSeriesRun, 'scheduledTimeMs' | 'startedTimeMs' | 'endedTimeMs'>
): PopoverEntryRow[] {
  return [
    {
      label: RUN_POPOVER_TIMESTAMP_LABELS.scheduled,
      value: formatTimestamp(run.scheduledTimeMs),
    },
    {
      label: RUN_POPOVER_TIMESTAMP_LABELS.started,
      value: formatTimestamp(run.startedTimeMs),
    },
    {
      label: RUN_POPOVER_TIMESTAMP_LABELS.ended,
      value: formatTimestamp(run.endedTimeMs),
    },
  ];
}
