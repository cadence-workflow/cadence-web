import formatTimestampToMs from '@/utils/data-formatters/format-timestamp-to-ms';

import {
  type GetScheduleTimelineBoundsParams,
  type ScheduleTimelineBounds,
} from '../use-schedule-runs-chart-data.types';

export default function getScheduleTimelineBounds({
  describeSchedule,
}: GetScheduleTimelineBoundsParams): ScheduleTimelineBounds {
  const createTimeMs = formatTimestampToMs(describeSchedule?.info?.createTime);
  const specStartTimeMs = formatTimestampToMs(
    describeSchedule?.spec?.startTime
  );
  const scheduleEndMs = formatTimestampToMs(describeSchedule?.spec?.endTime);
  const scheduleStartCandidates = [createTimeMs, specStartTimeMs].filter(
    (value): value is number => value != null && Number.isFinite(value)
  );

  return {
    scheduleStartMs:
      scheduleStartCandidates.length > 0
        ? Math.max(...scheduleStartCandidates)
        : null,
    scheduleEndMs,
  };
}
