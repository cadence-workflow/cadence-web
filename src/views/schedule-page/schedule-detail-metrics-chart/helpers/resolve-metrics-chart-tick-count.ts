import {
  CHART_SERIES_MAX_TICK_COUNT,
  CHART_SERIES_MIN_TICK_COUNT,
  CHART_SERIES_TICK_LABEL_WIDTH_PX,
  CHART_SIDE_PADDING_PX,
} from '../schedule-detail-metrics-chart.constants';

export default function resolveMetricsChartTickCount(
  chartWidthPx: number
): number {
  const drawableWidthPx = chartWidthPx - CHART_SIDE_PADDING_PX * 2;
  const fittingTickCount =
    Math.floor(drawableWidthPx / CHART_SERIES_TICK_LABEL_WIDTH_PX) + 1;

  return Math.min(
    CHART_SERIES_MAX_TICK_COUNT,
    Math.max(CHART_SERIES_MIN_TICK_COUNT, fittingTickCount)
  );
}
