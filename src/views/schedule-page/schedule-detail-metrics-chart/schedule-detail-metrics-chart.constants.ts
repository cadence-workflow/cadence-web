import { type ScheduleMetricsChartStatusVariant } from './schedule-detail-metrics-chart-series.types';

export const CHART_HEIGHT_PX = 82;

/**
 * Every tick shifts the domain while following, re-rendering each glyph and its
 * popover. 5s stays sub-pixel at the default zoom and only becomes visible as
 * stepping at the minimum span, where one pixel is a fraction of a second.
 */
export const CURRENT_TIME_UPDATE_INTERVAL_MS = 5_000;

export const CHART_LIVE_REFRESH_INTERVAL_MS = 10_000;

export const CHART_TOOLBAR_BUTTON_LABELS = {
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  now: 'Now',
} as const;

export const CHART_EMPTY_STATE_MESSAGE = 'No chart data available yet';

export const CHART_FETCH_LOADING_MESSAGE = 'Loading older runs…';

export const CHART_LEGEND_TITLE = 'Runs';

/** Legend rows, in render order, mapping a status glyph to its label. */
export const CHART_LEGEND_ITEMS = [
  { variant: 'completed', label: 'Completed' },
  { variant: 'failed', label: 'Terminated/Failed' },
  { variant: 'running', label: 'Running' },
  { variant: 'canceled', label: 'Cancelled' },
  { variant: 'skipped', label: 'Skipped' },
  { variant: 'next', label: 'Next run' },
] as const satisfies ReadonlyArray<{
  variant: ScheduleMetricsChartStatusVariant;
  label: string;
}>;

/** Icon size for the legend glyphs (px). */
export const CHART_LEGEND_ICON_SIZE_PX = 12;

/** Icon size for the toolbar control glyphs (px). */
export const CHART_TOOLBAR_ICON_SIZE_PX = 12;

export const CHART_REGION_ARIA_LABEL = 'Schedule metrics chart';

export const CHART_TOOLBAR_ARIA_LABEL = 'Chart controls';

/** Minimum time span when domain collapses to a single timestamp (ms). */
export const CHART_MIN_DOMAIN_SPAN_MS = 5 * 60_000;

/** Default past window when no run timestamps are available (ms). */
export const CHART_DEFAULT_PAST_WINDOW_MS = 6 * 60 * 60_000;

/** Padding to the right of `now` reserved for upcoming expected executions (ms). */
export const CHART_FUTURE_GUTTER_MS = 30 * 60_000;

/** Multiplier applied when zooming in (smaller span). */
export const CHART_ZOOM_IN_FACTOR = 0.5;

/** Multiplier applied when zooming out (larger span). */
export const CHART_ZOOM_OUT_FACTOR = 2;

/** Maximum zoom-out clicks beyond the initial readable view. */
export const CHART_MAX_ZOOM_OUT_STEPS = 2;

/** Horizontal position of `now` after panning (0 = left edge, 1 = right edge). */
export const CHART_NOW_ANCHOR_RATIO = 0.85;

/** Horizontal position of the next run when following pulls it into view. */
export const CHART_NEXT_RUN_ANCHOR_RATIO = 0.95;

/** Horizontal inset applied to the chart drawable area (px). */
export const CHART_SIDE_PADDING_PX = 24;

/** Horizontal space reserved per expected run when choosing the initial zoom (px). */
export const CHART_EXPECTED_RUN_SLOT_PX = 48;

export const CHART_SERIES_TEST_IDS = {
  svg: 'schedule-metrics-chart-series-svg',
  nextExecutionMarker: 'schedule-metrics-chart-next-execution-marker',
  nowMarker: 'schedule-metrics-chart-now-marker',
} as const;

export const CHART_SERIES_TIMELINE_Y_PX = 58;
export const CHART_SERIES_LABEL_Y_PX = 14;
/** Horizontal space a `MMM D, HH:mm` tick label needs to stay legible (px). */
export const CHART_SERIES_TICK_LABEL_WIDTH_PX = 112;
export const CHART_SERIES_MIN_TICK_COUNT = 2;
export const CHART_SERIES_MAX_TICK_COUNT = 7;
export const CHART_SERIES_NOW_STROKE_WIDTH_PX = 1;
export const CHART_SERIES_TICK_FONT_SIZE_PX = 11;

/** Header row height, sized to fit the mini toolbar buttons (px). */
export const CHART_HEADER_MIN_HEIGHT_PX = 28;
export const CHART_TOOLBAR_BUTTON_MIN_HEIGHT_PX = 26;

export const CHART_WORKFLOWS_PAGE_SIZE = 20;

export const CHART_INITIAL_EXPECTED_RUN_COUNT = 20;

export const CHART_DEFAULT_VIEW_SPAN_MS = 6 * 60 * 60_000;

export const CHART_PAN_FETCH_EDGE_THRESHOLD_RATIO = 0.05;

export const CHART_LOADING_SKELETON_TEST_ID =
  'schedule-metrics-chart-loading-skeleton';

export const CHART_FETCH_LOADING_TEST_ID =
  'schedule-metrics-chart-fetch-loading';

export const CHART_GLYPH_HIT_AREA_RADIUS_PX = 10;

/** Rendered size of a single status glyph inside its hit area (px). */
export const CHART_GLYPH_MARKER_SIZE_PX = 20;

/** Size of the small backfill badge pinned to a glyph's corner (px). */
export const CHART_GLYPH_BACKFILL_BADGE_SIZE_PX = 10;

/** Corner offset and padding for the backfill badge (px). */
export const CHART_GLYPH_BACKFILL_BADGE_OFFSET_PX = 4;
export const CHART_GLYPH_BACKFILL_BADGE_PADDING_PX = 2;

/** Horizontal offsets of the stacked cards behind a grouped glyph (px). */
export const CHART_GLYPH_GROUPED_CARD_OFFSETS_PX = {
  far: 8,
  near: 4,
} as const;

/** `MdReportGmailerrorred` reads small at nominal size, so it is scaled up. */
export const CHART_FAILED_ICON_SCALE = 1.2;

export const CHART_RUN_POPOVER_ENTRY_DELAY_MS = 200;

export const CHART_GLYPH_TEST_IDS = {
  runTrigger: 'schedule-metrics-chart-run-trigger',
  skippedExecutionTrigger: 'schedule-metrics-chart-skipped-execution-trigger',
} as const;

export const CHART_SUMMARY_TEST_ID = 'schedule-metrics-chart-summary';

export const CHART_CANVAS_TEST_ID = 'schedule-metrics-chart-canvas';
