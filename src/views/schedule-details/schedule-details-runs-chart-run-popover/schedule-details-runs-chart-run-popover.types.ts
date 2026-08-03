import { type ChartSeriesRun } from '@/views/schedule-details/schedule-details-runs-chart-series/schedule-details-runs-chart-series.types';

export type Props = {
  runs: ChartSeriesRun[];
  domain: string;
  cluster: string;
};
