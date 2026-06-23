import { type ScheduleMetricsChartRun } from '../schedule-detail-metrics-chart-series.types';

export type Props = {
  x: number;
  y: number;
  runs: ScheduleMetricsChartRun[];
  domain: string;
  cluster: string;
  variant: 'successful' | 'missed';
  testId: string;
};
