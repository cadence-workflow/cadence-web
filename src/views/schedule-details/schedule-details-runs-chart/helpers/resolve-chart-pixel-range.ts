import { CHART_SIDE_PADDING_PX } from '../schedule-details-runs-chart.constants';
import {
  type ChartPixelRange,
  type ResolveChartPixelRangeParams,
} from '../schedule-details-runs-chart.types';

export default function resolveChartPixelRange({
  widthPx,
  sidePaddingPx = CHART_SIDE_PADDING_PX,
}: ResolveChartPixelRangeParams): ChartPixelRange | null {
  if (!Number.isFinite(widthPx) || widthPx <= 0) {
    return null;
  }

  const drawableWidthPx = widthPx - sidePaddingPx * 2;

  if (drawableWidthPx <= 0) {
    return null;
  }

  return {
    startPx: sidePaddingPx,
    endPx: sidePaddingPx + drawableWidthPx,
  };
}
