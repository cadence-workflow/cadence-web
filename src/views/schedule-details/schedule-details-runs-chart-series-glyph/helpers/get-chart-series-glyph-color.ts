import { type Theme } from 'baseui';

import { type ChartSeriesGlyphVariant } from '../../schedule-details-runs-chart-series/schedule-details-runs-chart-series.types';

export default function getChartSeriesGlyphColor(
  theme: Theme,
  variant: ChartSeriesGlyphVariant
): string {
  switch (variant) {
    case 'completed':
      return theme.colors.positive400;
    case 'failed':
      return theme.colors.negative400;
    case 'running':
      return theme.colors.accent400;
    case 'canceled':
      return theme.colors.warning400;
    case 'skipped':
    case 'next':
      return theme.colors.contentSecondary;
  }
}
