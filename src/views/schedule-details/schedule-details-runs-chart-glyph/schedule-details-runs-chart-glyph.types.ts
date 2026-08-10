import { type WORKFLOW_STATUSES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

export type ChartGlyphVariant = WorkflowStatus | 'skipped' | 'loading' | 'next';

/** Variants with a fixed icon, shared by the timeline glyph and the legend. */
export type ChartStatusIconVariant = Exclude<
  ChartGlyphVariant,
  typeof WORKFLOW_STATUSES.running | 'skipped' | 'loading'
>;

export type Props = {
  /** Timeline pixel position of the marker's center. Omit when the glyph is centered by a parent trigger. */
  x?: number;
  y?: number;
  variant: ChartGlyphVariant;
  /** More than one run at this position renders a stacked count marker instead of a status icon. */
  runCount?: number;
  isBackfill?: boolean;
  /** Plays a brief scale/fade-in enter animation, for a glyph that just arrived on a live chart. */
  isNew?: boolean;
  label: string;
  testId: string;
};
