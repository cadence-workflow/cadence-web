import {
  CHART_MAX_TICK_COUNT,
  CHART_MIN_TICK_COUNT,
} from '../../schedule-details-runs-chart-timeline.constants';
import resolveChartTickCount from '../resolve-chart-tick-count';

describe(resolveChartTickCount.name, () => {
  it('adds ticks as the chart gets wider, up to the readable maximum', () => {
    expect(resolveChartTickCount(320)).toBe(3);
    expect(resolveChartTickCount(560)).toBe(5);
    expect(resolveChartTickCount(800)).toBe(CHART_MAX_TICK_COUNT);
    expect(resolveChartTickCount(2000)).toBe(CHART_MAX_TICK_COUNT);
  });

  it('keeps the range endpoints labeled on very narrow charts', () => {
    expect(resolveChartTickCount(120)).toBe(CHART_MIN_TICK_COUNT);
    expect(resolveChartTickCount(0)).toBe(CHART_MIN_TICK_COUNT);
  });
});
