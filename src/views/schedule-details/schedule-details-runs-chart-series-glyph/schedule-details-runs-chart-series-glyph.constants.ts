/** Footprint of a glyph, grouped card, and its status icon alike (px). */
export const CHART_GLYPH_MARKER_SIZE_PX = 20;

/**
 * `MdReportGmailerrorred`'s glyph is an 18x18 shape centered in its 24x24
 * viewBox; the other status icons' glyphs are 20x20 circles in the same
 * viewBox, so at the same `size="100%"` the failed icon reads smaller.
 * Cropping the viewBox to 21.6x21.6 (18 / (20/24)) around the glyph's
 * center makes it fill its box at the same 20/24 ratio as the others,
 * without scaling the icon past its box.
 */
export const CHART_GLYPH_FAILED_ICON_VIEW_BOX = '1.2 1.2 21.6 21.6';

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
