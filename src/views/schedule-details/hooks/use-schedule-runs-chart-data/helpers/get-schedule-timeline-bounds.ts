import formatTimestampToMs from '@/utils/data-formatters/format-timestamp-to-ms';

import {
  type GetScheduleTimelineBoundsParams,
  type ScheduleTimelineBounds,
} from '../use-schedule-runs-chart-data.types';

export default function getScheduleTimelineBounds({
  describeSchedule,
  retentionSeconds,
  nowMs,
}: GetScheduleTimelineBoundsParams): ScheduleTimelineBounds {
  const createTimeMs = formatTimestampToMs(describeSchedule?.info?.createTime);
  const lastUpdateTimeMs = formatTimestampToMs(
    describeSchedule?.info?.lastUpdateTime
  );
  const specStartTimeMs = formatTimestampToMs(
    describeSchedule?.spec?.startTime
  );
  const scheduleEndMs = formatTimestampToMs(describeSchedule?.spec?.endTime);
  const retentionCutoffMs =
    retentionSeconds != null && Number.isFinite(retentionSeconds)
      ? nowMs - retentionSeconds * 1000
      : null;
  const inferenceCandidates = [
    createTimeMs,
    retentionCutoffMs,
    lastUpdateTimeMs,
    specStartTimeMs,
  ].filter((value): value is number => value != null && Number.isFinite(value));

  return {
    inferenceStartMs:
      inferenceCandidates.length > 0 ? Math.max(...inferenceCandidates) : null,
    scheduleEndMs,
  };
}
