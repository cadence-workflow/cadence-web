import { type ScaleLinear } from 'd3-scale';

export type ScheduleMetricsChartExecutionPoint = {
  scheduledTimeMs: number;
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
