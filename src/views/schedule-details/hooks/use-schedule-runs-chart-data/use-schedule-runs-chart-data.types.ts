import { type ChartSeriesData } from '@/views/schedule-details/schedule-details-runs-chart-series/schedule-details-runs-chart-series.types';

export type UseScheduleRunsChartDataParams = {
  domain: string;
  cluster: string;
  scheduleId: string;
};

export type UseScheduleRunsChartDataResult = {
  data: ChartSeriesData;
  isLoading: boolean;
};
