import { CHART_SIDE_PADDING_PX } from '../schedule-details-runs-chart.constants';

export type ResolveChartSpanFromMarkerIntervalMsParams = {
  intervalMs: number;
  chartWidthPx: number;
  /** Target px distance between consecutive markers at this zoom level. */
  pxPerInterval: number;
  sidePaddingPx?: number;
};

/** Maps a marker cadence to the time span that yields `pxPerInterval` on screen. */
export default function resolveChartSpanFromMarkerIntervalMs({
  intervalMs,
  chartWidthPx,
  pxPerInterval,
  sidePaddingPx = CHART_SIDE_PADDING_PX,
}: ResolveChartSpanFromMarkerIntervalMsParams): number {
  const drawableWidthPx = chartWidthPx - sidePaddingPx * 2;

  if (
    !Number.isFinite(intervalMs) ||
    intervalMs <= 0 ||
    !Number.isFinite(chartWidthPx) ||
    chartWidthPx <= 0 ||
    !Number.isFinite(pxPerInterval) ||
    pxPerInterval <= 0 ||
    drawableWidthPx <= 0
  ) {
    return 0;
  }

  return (intervalMs * drawableWidthPx) / pxPerInterval;
}
