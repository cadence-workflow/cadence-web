import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';
import formatTimestampToDatetime from '@/utils/data-formatters/format-timestamp-to-datetime';

export default function describeScheduleToNextExecutionMs(
  describeSchedule: DescribeScheduleResponse | undefined
): number | null {
  const datetime = formatTimestampToDatetime(
    describeSchedule?.info?.nextRunTime
  );

  return datetime?.valueOf() ?? null;
}
