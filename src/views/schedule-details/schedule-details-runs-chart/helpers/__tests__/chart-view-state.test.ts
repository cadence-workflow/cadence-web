import { CHART_MIN_DOMAIN_SPAN_MS } from '../../schedule-details-runs-chart.constants';
import {
  canZoomChartIn,
  canZoomChartOut,
  clampChartVisibleTimeWindow,
  getChartTimeWindowSpanMs,
  isSameChartTimeWindow,
  panChartTimeWindowToTime,
  resolveChartFollowTimeWindow,
  shiftChartTimeWindow,
  zoomChartTimeWindow,
} from '../chart-view-state';

const hourMs = 60 * 60_000;
const bounds = { minMs: 0, maxMs: 10 * hourMs };

describe(getChartTimeWindowSpanMs.name, () => {
  it('returns the difference between max and min', () => {
    expect(getChartTimeWindowSpanMs({ minMs: 10, maxMs: 30 })).toBe(20);
  });
});

describe(isSameChartTimeWindow.name, () => {
  it('compares both bounds', () => {
    expect(
      isSameChartTimeWindow({ minMs: 10, maxMs: 30 }, { minMs: 10, maxMs: 30 })
    ).toBe(true);
    expect(
      isSameChartTimeWindow({ minMs: 10, maxMs: 30 }, { minMs: 10, maxMs: 31 })
    ).toBe(false);
  });
});

describe(clampChartVisibleTimeWindow.name, () => {
  it('leaves a window fully within bounds untouched', () => {
    expect(
      clampChartVisibleTimeWindow(
        { minMs: 1 * hourMs, maxMs: 2 * hourMs },
        bounds
      )
    ).toEqual({ minMs: 1 * hourMs, maxMs: 2 * hourMs });
  });

  it('shifts a window that overshoots the upper bound', () => {
    expect(
      clampChartVisibleTimeWindow(
        { minMs: 9 * hourMs, maxMs: 12 * hourMs },
        bounds
      )
    ).toEqual({ minMs: 7 * hourMs, maxMs: 10 * hourMs });
  });

  it('returns the full bounds when the visible span exceeds it', () => {
    expect(
      clampChartVisibleTimeWindow(
        { minMs: -5 * hourMs, maxMs: 20 * hourMs },
        bounds
      )
    ).toEqual(bounds);
  });

  it('expands a sub-min span near the lower bound without leaving bounds', () => {
    expect(
      clampChartVisibleTimeWindow({ minMs: 0, maxMs: 60_000 }, bounds)
    ).toEqual({ minMs: 0, maxMs: CHART_MIN_DOMAIN_SPAN_MS });
  });

  it('returns full bounds when the minimum span exceeds the navigable range', () => {
    const narrowBounds = { minMs: 0, maxMs: 2 * 60_000 };

    expect(
      clampChartVisibleTimeWindow({ minMs: 0, maxMs: 60_000 }, narrowBounds)
    ).toEqual(narrowBounds);
  });
});

describe(zoomChartTimeWindow.name, () => {
  const visibleWindow = { minMs: 4 * hourMs, maxMs: 6 * hourMs };

  it('shrinks the span around the anchor when zooming in', () => {
    const zoomed = zoomChartTimeWindow({
      visibleWindow,
      bounds,
      maxSpanMs: 10 * hourMs,
      factor: 0.5,
      anchorMs: 5 * hourMs,
    });

    expect(getChartTimeWindowSpanMs(zoomed)).toBe(1 * hourMs);
    expect(zoomed).toEqual({ minMs: 4.5 * hourMs, maxMs: 5.5 * hourMs });
  });

  it('never zooms in past the minimum domain span', () => {
    const zoomed = zoomChartTimeWindow({
      visibleWindow: {
        minMs: 5 * hourMs - 60_000,
        maxMs: 5 * hourMs + 60_000,
      },
      bounds,
      maxSpanMs: 10 * hourMs,
      factor: 0.1,
      anchorMs: 5 * hourMs,
    });

    expect(getChartTimeWindowSpanMs(zoomed)).toBe(CHART_MIN_DOMAIN_SPAN_MS);
  });

  it('caps the span at maxSpanMs when zooming out', () => {
    const zoomed = zoomChartTimeWindow({
      visibleWindow,
      bounds,
      maxSpanMs: 2.5 * hourMs,
      factor: 4,
      anchorMs: 5 * hourMs,
    });

    expect(getChartTimeWindowSpanMs(zoomed)).toBe(2.5 * hourMs);
  });

  it('anchors on the window center when the anchor is off-screen', () => {
    const zoomed = zoomChartTimeWindow({
      visibleWindow,
      bounds,
      maxSpanMs: 10 * hourMs,
      factor: 0.5,
      anchorMs: 9.9 * hourMs,
    });

    expect(zoomed).toEqual({ minMs: 4.5 * hourMs, maxMs: 5.5 * hourMs });
  });
});

describe(panChartTimeWindowToTime.name, () => {
  it('centers the window on timeMs using the given anchor ratio', () => {
    const panned = panChartTimeWindowToTime({
      visibleWindow: { minMs: 0, maxMs: 1 * hourMs },
      bounds: { minMs: -100 * hourMs, maxMs: 100 * hourMs },
      timeMs: 5 * hourMs,
      anchorRatio: 0.5,
    });

    expect(panned).toEqual({ minMs: 4.5 * hourMs, maxMs: 5.5 * hourMs });
  });

  it('clamps the panned window to bounds', () => {
    const panned = panChartTimeWindowToTime({
      visibleWindow: { minMs: 0, maxMs: 1 * hourMs },
      bounds,
      timeMs: 20 * hourMs,
      anchorRatio: 0.5,
    });

    expect(panned.maxMs).toBe(bounds.maxMs);
  });
});

describe(shiftChartTimeWindow.name, () => {
  it('shifts both bounds by deltaMs when unbounded', () => {
    expect(
      shiftChartTimeWindow({
        visibleWindow: { minMs: 10_000, maxMs: 20_000 },
        deltaMs: -5_000,
      })
    ).toEqual({ minMs: 5_000, maxMs: 15_000 });
  });

  it('clamps the shift to the lower bound, preserving span', () => {
    expect(
      shiftChartTimeWindow({
        visibleWindow: { minMs: 10_000, maxMs: 20_000 },
        deltaMs: -50_000,
        bounds: { minMs: 0, maxMs: 100_000 },
      })
    ).toEqual({ minMs: 0, maxMs: 10_000 });
  });

  it('clamps the shift to the upper bound, preserving span', () => {
    expect(
      shiftChartTimeWindow({
        visibleWindow: { minMs: 10_000, maxMs: 20_000 },
        deltaMs: 500_000,
        bounds: { minMs: 0, maxMs: 100_000 },
      })
    ).toEqual({ minMs: 90_000, maxMs: 100_000 });
  });
});

describe(canZoomChartIn.name, () => {
  it('is true while the span is above the minimum', () => {
    expect(
      canZoomChartIn({ minMs: 0, maxMs: CHART_MIN_DOMAIN_SPAN_MS * 2 })
    ).toBe(true);
    expect(canZoomChartIn({ minMs: 0, maxMs: CHART_MIN_DOMAIN_SPAN_MS })).toBe(
      false
    );
  });
});

describe(canZoomChartOut.name, () => {
  it('is true while the span is below maxSpanMs', () => {
    expect(canZoomChartOut({ minMs: 0, maxMs: 1 * hourMs }, 2 * hourMs)).toBe(
      true
    );
    expect(canZoomChartOut({ minMs: 0, maxMs: 2 * hourMs }, 2 * hourMs)).toBe(
      false
    );
  });
});

describe(resolveChartFollowTimeWindow.name, () => {
  const followBounds = { minMs: -100 * hourMs, maxMs: 100 * hourMs };

  it('anchors on now when there is no pending next execution', () => {
    const window = resolveChartFollowTimeWindow({
      visibleWindow: { minMs: -1 * hourMs, maxMs: 1 * hourMs },
      bounds: followBounds,
      nowMs: 0,
    });

    expect(window.maxMs).toBeGreaterThan(0);
    expect(window.minMs).toBeLessThan(0);
  });

  it('pulls the next execution into view when it would otherwise be cut off', () => {
    const window = resolveChartFollowTimeWindow({
      visibleWindow: { minMs: -1 * hourMs, maxMs: 1 * hourMs },
      bounds: followBounds,
      nowMs: 0,
      nextExecutionMs: 1.5 * hourMs,
    });

    expect(window.maxMs).toBeGreaterThanOrEqual(1.5 * hourMs);
    expect(window.minMs).toBeLessThanOrEqual(0);
  });
});
