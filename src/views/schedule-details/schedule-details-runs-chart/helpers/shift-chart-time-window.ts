import {
  type ChartTimeWindow,
  type ShiftChartTimeWindowParams,
} from '../schedule-details-runs-chart.types';

export default function shiftChartTimeWindow({
  visibleWindow,
  deltaMs,
  bounds,
}: ShiftChartTimeWindowParams): ChartTimeWindow {
  const spanMs = visibleWindow.maxMs - visibleWindow.minMs;
  let minMs = visibleWindow.minMs + deltaMs;
  let maxMs = visibleWindow.maxMs + deltaMs;

  if (bounds) {
    if (minMs < bounds.minMs) {
      minMs = bounds.minMs;
      maxMs = minMs + spanMs;
    }

    if (maxMs > bounds.maxMs) {
      maxMs = bounds.maxMs;
      minMs = maxMs - spanMs;
    }
  }

  return { minMs, maxMs };
}
