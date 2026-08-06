import { type ChartTimeWindow } from '@/views/schedule-details/schedule-details-runs-chart/schedule-details-runs-chart.types';

export type UseScheduleRunsChartViewStateParams = {
  bounds: ChartTimeWindow | null;
  nowMs: number;
  nextExecutionMs?: number | null;
};

export type UseScheduleRunsChartViewStateResult = {
  visibleWindow: ChartTimeWindow | null;
  canZoomIn: boolean;
  canZoomOut: boolean;
  initializeWindow: (window: ChartTimeWindow, maxSpanMs: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
};
