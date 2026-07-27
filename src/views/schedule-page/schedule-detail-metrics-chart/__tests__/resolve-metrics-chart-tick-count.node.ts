import resolveMetricsChartTickCount from '../helpers/resolve-metrics-chart-tick-count';
import {
  CHART_SERIES_MAX_TICK_COUNT,
  CHART_SERIES_MIN_TICK_COUNT,
} from '../schedule-detail-metrics-chart.constants';

describe(resolveMetricsChartTickCount.name, () => {
  it('adds ticks as the chart gets wider, up to the readable maximum', () => {
    expect(resolveMetricsChartTickCount(320)).toBe(3);
    expect(resolveMetricsChartTickCount(560)).toBe(5);
    expect(resolveMetricsChartTickCount(800)).toBe(CHART_SERIES_MAX_TICK_COUNT);
    expect(resolveMetricsChartTickCount(2000)).toBe(
      CHART_SERIES_MAX_TICK_COUNT
    );
  });

  it('keeps the range endpoints labeled on very narrow charts', () => {
    expect(resolveMetricsChartTickCount(120)).toBe(CHART_SERIES_MIN_TICK_COUNT);
    expect(resolveMetricsChartTickCount(0)).toBe(CHART_SERIES_MIN_TICK_COUNT);
  });
});
