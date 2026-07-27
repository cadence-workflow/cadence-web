import {
  type ScheduleMetricsChartGlyphVariant,
  type ScheduleMetricsChartRun,
} from './schedule-detail-metrics-chart-series.types';

export type Props = {
  x: number;
  y: number;
  runs: ScheduleMetricsChartRun[];
  scheduledTimeMs?: number;
  domain: string;
  cluster: string;
  scheduleId: string;
  variant: ScheduleMetricsChartGlyphVariant;
  /** Plays the enter animation, for glyphs that arrive on an already open chart. */
  isNew?: boolean;
  testId: string;
};
