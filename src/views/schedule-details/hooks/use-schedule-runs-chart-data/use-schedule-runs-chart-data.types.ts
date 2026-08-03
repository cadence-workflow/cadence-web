import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';
import { type ChartSeriesData } from '@/views/schedule-details/schedule-details-runs-chart-series/schedule-details-runs-chart-series.types';

export type UseScheduleRunsChartDataParams = {
  domain: string;
  cluster: string;
  scheduleId: string;
  nowMs: number;
};

export type UseScheduleRunsChartDataResult = {
  data: ChartSeriesData;
  isLoading: boolean;
};

export type GetScheduleTimelineBoundsParams = {
  describeSchedule: DescribeScheduleResponse | undefined;
  retentionSeconds: number | null;
  nowMs: number;
};

export type ScheduleTimelineBounds = {
  inferenceStartMs: number | null;
  scheduleEndMs: number | null;
};

export type GetExpectedScheduleTimesMsParams = {
  cronExpression: string;
  startMs: number;
  endMs: number;
  limit?: number;
};

export type GetSkippedScheduleTimesMsParams = {
  expectedTimesMs: number[];
  actualTimesMs: number[];
};

export type GetSkippedScheduleExecutionsParams = {
  cronExpression: string;
  inferenceStartMs: number | null;
  scheduleEndMs: number | null;
  oldestLoadedScheduleTimeMs: number | null;
  hasNextPage: boolean;
  nowMs: number;
  nextExecutionTimeMs?: number | null;
  actualTimesMs: number[];
};
