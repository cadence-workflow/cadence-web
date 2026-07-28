import { scaleLinear } from '@visx/scale';
import { type ScaleLinear } from 'd3-scale';

import { type CreateChartXScaleParams } from '../schedule-details-runs-chart.types';

type ChartXScale = ScaleLinear<number, number, never>;

export default function createChartXScale({
  timeWindow,
  range,
}: CreateChartXScaleParams): ChartXScale | null {
  if (
    !Number.isFinite(timeWindow.minMs) ||
    !Number.isFinite(timeWindow.maxMs) ||
    timeWindow.maxMs <= timeWindow.minMs
  ) {
    return null;
  }

  if (
    !Number.isFinite(range.startPx) ||
    !Number.isFinite(range.endPx) ||
    range.endPx <= range.startPx
  ) {
    return null;
  }

  return scaleLinear<number>({
    domain: [timeWindow.minMs, timeWindow.maxMs],
    range: [range.startPx, range.endPx],
    clamp: true,
  });
}
