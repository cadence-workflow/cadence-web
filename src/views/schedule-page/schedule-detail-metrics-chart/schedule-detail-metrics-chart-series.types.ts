import { type ScaleLinear } from 'd3-scale';

import { type WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';

export type ScheduleMetricsChartRun = {
  runId: string;
  status: WorkflowExecutionCloseStatus;
  scheduledTimeMs: number;
  startedTimeMs: number | null;
  endedTimeMs: number | null;
  backfillId?: string;
};

export type ScheduleMetricsChartExecutionPoint = {
  scheduledTimeMs: number;
  runs: ScheduleMetricsChartRun[];
};

export type ScheduleMetricsChartSeriesData = {
  successfulRuns: ScheduleMetricsChartExecutionPoint[];
  missedExecutions: ScheduleMetricsChartExecutionPoint[];
  nextExecutionTimeMs: number | null;
};

export type ScheduleMetricsChartXScale = ScaleLinear<number, number, never>;

export type ScheduleMetricsChartSeriesProps = {
  width: number;
  height: number;
  xScale: ScheduleMetricsChartXScale;
  data: ScheduleMetricsChartSeriesData;
  successfulRunColor: string;
  missedExecutionColor: string;
  nextExecutionColor: string;
};

export type ScheduleMetricsChartGlyphVariant = 'successful' | 'missed';
