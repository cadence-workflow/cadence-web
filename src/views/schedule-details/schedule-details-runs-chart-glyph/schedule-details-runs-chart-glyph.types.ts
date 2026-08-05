import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

export type ChartGlyphVariant = WorkflowStatus | 'skipped' | 'loading' | 'next';

export type Props = {
  /** Timeline pixel position of the marker's center. Omit when the glyph is centered by a parent trigger. */
  x?: number;
  y?: number;
  variant: ChartGlyphVariant;
  /** More than one run at this position renders a stacked count marker instead of a status icon. */
  runCount?: number;
  isBackfill?: boolean;
  label: string;
  testId: string;
};
