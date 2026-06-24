import { type ScheduleMetricsChartRun } from '../schedule-detail-metrics-chart-series.types';

export type Props = {
  runs: ScheduleMetricsChartRun[];
  domain: string;
  cluster: string;
};
