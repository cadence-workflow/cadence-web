import { type ScaleLinear } from 'd3-scale';

import { type WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';

export type ScheduleMetricsChartRun = {
  workflowId: string;
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
  skippedExecutions: ScheduleMetricsChartExecutionPoint[];
  nextExecutionTimeMs: number | null;
};

export type ScheduleMetricsChartXScale = ScaleLinear<number, number, never>;

export type ScheduleMetricsChartSeriesProps = {
  width: number;
  height: number;
  xScale: ScheduleMetricsChartXScale;
  nowMs: number;
  timelineColor: string;
  labelColor: string;
  labelStrongColor: string;
  nowColor: string;
};

export type ScheduleMetricsChartStatusVariant =
  | 'completed'
  | 'failed'
  | 'running'
  | 'canceled'
  | 'backfill'
  | 'skipped'
  | 'next';

export type ScheduleMetricsChartGlyphVariant =
  | ScheduleMetricsChartStatusVariant
  | 'grouped';
