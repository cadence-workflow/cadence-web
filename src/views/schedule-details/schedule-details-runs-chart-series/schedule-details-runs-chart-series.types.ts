import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

import { type ChartXScale } from '../schedule-details-runs-chart/schedule-details-runs-chart.types';

export type ChartSeriesRun = {
  workflowId: string;
  runId: string;
  scheduledTimeMs: number;
  status: WorkflowStatus;
  startedTimeMs: number | null;
  endedTimeMs: number | null;
  isBackfill?: boolean;
  backfillId?: string;
};

export type ChartSeriesExecutionPoint = {
  scheduledTimeMs: number;
};

export type ChartSeriesData = {
  runs: ChartSeriesRun[];
  skippedExecutions: ChartSeriesExecutionPoint[];
  unconfirmedExecutions: ChartSeriesExecutionPoint[];
  nextExecutionTimeMs: number | null;
};

export type ChartSeriesMarker =
  | { kind: 'run'; scheduledTimeMs: number; runs: ChartSeriesRun[] }
  | { kind: 'skipped'; scheduledTimeMs: number }
  | { kind: 'loading'; scheduledTimeMs: number }
  | { kind: 'next'; scheduledTimeMs: number };

export type ChartSeriesNewTimesMs = {
  runs: ReadonlySet<number>;
  skipped: ReadonlySet<number>;
  next: ReadonlySet<number>;
};

export type Props = {
  xScale: ChartXScale;
  data: ChartSeriesData;
  domain: string;
  cluster: string;
  newTimesMs?: ChartSeriesNewTimesMs;
};
