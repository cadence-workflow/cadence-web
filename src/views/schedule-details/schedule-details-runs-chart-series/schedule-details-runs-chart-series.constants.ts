export const CHART_SERIES_TEST_IDS = {
  svg: 'schedule-runs-chart-series',
  successfulRunMarker: 'schedule-runs-chart-successful-run-marker',
  missedExecutionMarker: 'schedule-runs-chart-missed-execution-marker',
  nextExecutionMarker: 'schedule-runs-chart-next-execution-marker',
} as const;

export const CHART_SERIES_MARKER_RADIUS_PX = 5;
export const CHART_SERIES_MISSED_MARKER_RADIUS_PX = 6;
export const CHART_SERIES_NEXT_EXECUTION_STROKE_WIDTH_PX = 2;
export const CHART_SERIES_MISSED_STROKE_WIDTH_PX = 2;

/** Baseline ratios (of chart height) the run markers sit on. */
export const CHART_SERIES_SUCCESS_Y_RATIO = 0.45;
export const CHART_SERIES_MISSED_Y_RATIO = 0.65;
