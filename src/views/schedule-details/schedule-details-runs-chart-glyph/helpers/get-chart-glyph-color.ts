import { type Theme } from 'baseui';

import { type ChartGlyphVariant } from '../schedule-details-runs-chart-glyph.types';

export default function getChartGlyphColor(
  theme: Theme,
  variant: ChartGlyphVariant
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
