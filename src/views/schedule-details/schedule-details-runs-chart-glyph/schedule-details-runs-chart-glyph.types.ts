import { type ChartSeriesRunStatus } from '../schedule-details-runs-chart-series/schedule-details-runs-chart-series.types';

export type ChartGlyphVariant = ChartSeriesRunStatus | 'skipped' | 'next';

export type Props = {
  /** Timeline pixel position of the marker's center. */
  x: number;
  y: number;
  variant: ChartGlyphVariant;
  /** More than one run at this position renders a stacked count marker instead of a status icon. */
  runCount?: number;
  isBackfill?: boolean;
  label: string;
  testId: string;
};
