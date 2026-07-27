import {
  type ScheduleMetricsChartGlyphVariant,
  type ScheduleMetricsChartRun,
} from './schedule-detail-metrics-chart-series.types';

export type Props = {
  x: number;
  y: number;
  runs: ScheduleMetricsChartRun[];
  scheduledTimeMs?: number;
  domain: string;
  cluster: string;
  variant: ScheduleMetricsChartGlyphVariant;
  testId: string;
};
