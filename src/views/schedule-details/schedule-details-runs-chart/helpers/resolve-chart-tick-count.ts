import {
  CHART_MAX_TICK_COUNT,
  CHART_MIN_TICK_COUNT,
  CHART_SIDE_PADDING_PX,
  CHART_TICK_LABEL_WIDTH_PX,
} from '../schedule-details-runs-chart.constants';

export default function resolveChartTickCount(chartWidthPx: number): number {
  const drawableWidthPx = chartWidthPx - CHART_SIDE_PADDING_PX * 2;
  const fittingTickCount =
    Math.floor(drawableWidthPx / CHART_TICK_LABEL_WIDTH_PX) + 1;

  return Math.min(
    CHART_MAX_TICK_COUNT,
    Math.max(CHART_MIN_TICK_COUNT, fittingTickCount)
  );
}
