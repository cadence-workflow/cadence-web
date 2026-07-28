import { type ChartXScale } from '../schedule-details-runs-chart/schedule-details-runs-chart.types';

export type ChartSeriesExecutionPoint = {
  scheduledTimeMs: number;
};

export type ChartSeriesData = {
  successfulRuns: ChartSeriesExecutionPoint[];
  missedExecutions: ChartSeriesExecutionPoint[];
  nextExecutionTimeMs: number | null;
};

export type Props = {
  height: number;
  xScale: ChartXScale;
  data: ChartSeriesData;
  successfulRunColor: string;
  missedExecutionColor: string;
  nextExecutionColor: string;
};
