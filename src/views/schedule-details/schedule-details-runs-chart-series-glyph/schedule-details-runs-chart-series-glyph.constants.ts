/** Footprint of a glyph, grouped card, and its status icon alike (px). */
export const CHART_GLYPH_MARKER_SIZE_PX = 20;

/** `MdReportGmailerrorred` reads small at nominal size, so it is scaled up. */
export const CHART_GLYPH_FAILED_ICON_SCALE = 1.2;

/** Size of the history icon inside the backfill badge (px); padding grows the badge past this. */
export const CHART_GLYPH_BACKFILL_BADGE_ICON_SIZE_PX = 10;
export const CHART_GLYPH_BACKFILL_BADGE_PADDING_PX = 2;
export const CHART_GLYPH_BACKFILL_BADGE_OFFSET_PX = 4;

/** Horizontal offsets of the stacked cards behind a grouped glyph (px). */
export const CHART_GLYPH_GROUPED_CARD_OFFSETS_PX = {
  far: 8,
  near: 4,
} as const;

export const CHART_GLYPH_TEST_IDS = {
  backfillBadge: 'schedule-runs-chart-glyph-backfill-badge',
} as const;
