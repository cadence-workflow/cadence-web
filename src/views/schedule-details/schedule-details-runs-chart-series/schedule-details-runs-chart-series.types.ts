import { type ChartXScale } from '../schedule-details-runs-chart/schedule-details-runs-chart.types';

/** Terminated, timed out, and failed share one channel: Cadence closes all three the same way from an operator's point of view. */
export type ChartSeriesRunStatus =
  | 'completed'
  | 'failed'
  | 'running'
  | 'canceled';

export type ChartSeriesRun = {
  runId: string;
  scheduledTimeMs: number;
  status: ChartSeriesRunStatus;
  isBackfill?: boolean;
};

export type ChartSeriesExecutionPoint = {
  scheduledTimeMs: number;
};

export type ChartSeriesGlyphVariant = ChartSeriesRunStatus | 'skipped' | 'next';

export type ChartSeriesData = {
  runs: ChartSeriesRun[];
  skippedExecutions: ChartSeriesExecutionPoint[];
  nextExecutionTimeMs: number | null;
};

export type Props = {
  xScale: ChartXScale;
  data: ChartSeriesData;
};
