import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';

export type GetScheduleTimelineBoundsParams = {
  describeSchedule: DescribeScheduleResponse | undefined;
  retentionSeconds: number | null;
  nowMs: number;
};

export type ScheduleTimelineBounds = {
  inferenceStartMs: number | null;
  scheduleEndMs: number | null;
};
