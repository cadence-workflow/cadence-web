import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';
import formatTimestampToMs from '@/utils/data-formatters/format-timestamp-to-ms';

export default function getScheduleNextExecutionTimeMs(
  describeSchedule: DescribeScheduleResponse | undefined
): number | null {
  if (describeSchedule?.state?.paused) {
    return null;
  }

  return formatTimestampToMs(describeSchedule?.info?.nextRunTime);
}
