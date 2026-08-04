import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';
import {
  type ChartSeriesData,
  type ChartSeriesExecutionPoint,
} from '@/views/schedule-details/schedule-details-runs-chart-series/schedule-details-runs-chart-series.types';

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
  timelineStartMs: number | null;
  scheduleEndMs: number | null;
};

export type GetExpectedScheduleTimesMsParams = {
  cronExpression: string;
  startMs: number;
  endMs: number;
  limit?: number;
};

export type GetScheduleExecutionGapsParams = {
  cronExpression: string;
  timelineStartMs: number | null;
  scheduleEndMs: number | null;
  oldestLoadedScheduleTimeMs: number | null;
  hasNextPage: boolean;
  /** When the runs page was last (re)fetched; slots due after this can't be confirmed yet. */
  lastFetchedAtMs: number | null;
  nowMs: number;
  nextExecutionTimeMs?: number | null;
  actualTimesMs: number[];
};

export type ScheduleExecutionGaps = {
  skippedExecutions: ChartSeriesExecutionPoint[];
  unconfirmedExecutions: ChartSeriesExecutionPoint[];
};
