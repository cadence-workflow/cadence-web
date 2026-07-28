export const CHART_HEIGHT_PX = 82;

/** Header row height, sized to fit the mini toolbar buttons (px). */
export const CHART_HEADER_MIN_HEIGHT_PX = 28;
export const CHART_TOOLBAR_BUTTON_MIN_HEIGHT_PX = 26;

/** Icon size for the toolbar control glyphs (px). */
export const CHART_TOOLBAR_ICON_SIZE_PX = 12;

export const CHART_TOOLBAR_BUTTON_LABELS = {
  zoomOut: 'Zoom out',
  zoomIn: 'Zoom in',
  now: 'Now',
} as const;

export const CHART_REGION_ARIA_LABEL = 'Schedule runs chart';

export const CHART_TOOLBAR_ARIA_LABEL = 'Chart controls';

export const CHART_TIMELINE_TEST_ID = 'schedule-runs-chart-timeline';

export const CHART_NOW_MARKER_TEST_ID = 'schedule-runs-chart-now-marker';

/**
 * How often `now` is re-read. 5s stays sub-pixel at the default zoom, so the
 * marker reads as continuous rather than stepping.
 */
export const CURRENT_TIME_UPDATE_INTERVAL_MS = 5_000;

/** Baseline the run markers will sit on, measured from the chart top (px). */
export const CHART_TIMELINE_Y_PX = 58;

/** Baseline of the time tick labels, measured from the chart top (px). */
export const CHART_TICK_LABEL_Y_PX = 14;

export const CHART_TICK_FONT_SIZE_PX = 11;

export const CHART_NOW_STROKE_WIDTH_PX = 1;

/** Horizontal space a `MMM D, HH:mm` tick label needs to stay legible (px). */
export const CHART_TICK_LABEL_WIDTH_PX = 112;
export const CHART_MIN_TICK_COUNT = 2;
export const CHART_MAX_TICK_COUNT = 7;

/** Minimum time span when domain collapses to a single timestamp (ms). */
export const CHART_MIN_DOMAIN_SPAN_MS = 5 * 60_000;

/** Default past window when no run timestamps are available (ms). */
export const CHART_DEFAULT_PAST_WINDOW_MS = 6 * 60 * 60_000;

/** Padding to the right of `now` reserved for upcoming expected executions (ms). */
export const CHART_FUTURE_GUTTER_MS = 30 * 60_000;

/** Horizontal inset applied to the chart drawable area (px). */
export const CHART_SIDE_PADDING_PX = 24;
