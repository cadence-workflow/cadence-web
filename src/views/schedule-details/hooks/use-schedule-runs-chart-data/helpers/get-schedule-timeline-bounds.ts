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
  const specStartTimeMs = formatTimestampToMs(
    describeSchedule?.spec?.startTime
  );
  const scheduleEndMs = formatTimestampToMs(describeSchedule?.spec?.endTime);
  const retentionCutoffMs =
    retentionSeconds != null && Number.isFinite(retentionSeconds)
      ? nowMs - retentionSeconds * 1000
      : null;

  const timelineStartCandidates = [
    createTimeMs,
    retentionCutoffMs,
    specStartTimeMs,
  ].filter((value): value is number => value != null && Number.isFinite(value));

  return {
    timelineStartMs:
      timelineStartCandidates.length > 0
        ? Math.max(...timelineStartCandidates)
        : null,
    scheduleEndMs,
  };
}
