import { type ChartSeriesRun } from '@/views/schedule-details/schedule-details-runs-chart-series/schedule-details-runs-chart-series.types';

export type Props = {
  x: number;
  y: number;
  runs: ChartSeriesRun[];
  domain: string;
  cluster: string;
  ariaLabel: string;
  testId: string;
};
