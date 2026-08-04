import { CHART_MIN_DOMAIN_SPAN_MS } from '../../schedule-details-runs-chart.constants';
import {
  canZoomChartIn,
  canZoomChartOut,
  clampChartVisibleTimeWindow,
  getChartTimeWindowSpanMs,
  isSameChartTimeWindow,
  panChartTimeWindowToTime,
  resolveChartFollowTimeWindow,
  zoomChartTimeWindow,
} from '../chart-view-state';

const HOUR_MS = 60 * 60_000;
const bounds = { minMs: 0, maxMs: 10 * HOUR_MS };

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
        { minMs: 1 * HOUR_MS, maxMs: 2 * HOUR_MS },
        bounds
      )
    ).toEqual({ minMs: 1 * HOUR_MS, maxMs: 2 * HOUR_MS });
  });

  it('shifts a window that overshoots the upper bound', () => {
    expect(
      clampChartVisibleTimeWindow(
        { minMs: 9 * HOUR_MS, maxMs: 12 * HOUR_MS },
        bounds
      )
    ).toEqual({ minMs: 7 * HOUR_MS, maxMs: 10 * HOUR_MS });
  });

  it('returns the full bounds when the visible span exceeds it', () => {
    expect(
      clampChartVisibleTimeWindow(
        { minMs: -5 * HOUR_MS, maxMs: 20 * HOUR_MS },
        bounds
      )
    ).toEqual(bounds);
  });
});

describe(zoomChartTimeWindow.name, () => {
  const visibleWindow = { minMs: 4 * HOUR_MS, maxMs: 6 * HOUR_MS };

  it('shrinks the span around the anchor when zooming in', () => {
    const zoomed = zoomChartTimeWindow({
      visibleWindow,
      bounds,
      maxSpanMs: 10 * HOUR_MS,
      factor: 0.5,
      anchorMs: 5 * HOUR_MS,
    });

    expect(getChartTimeWindowSpanMs(zoomed)).toBe(1 * HOUR_MS);
    expect(zoomed).toEqual({ minMs: 4.5 * HOUR_MS, maxMs: 5.5 * HOUR_MS });
  });

  it('never zooms in past the minimum domain span', () => {
    const zoomed = zoomChartTimeWindow({
      visibleWindow: {
        minMs: 5 * HOUR_MS - 60_000,
        maxMs: 5 * HOUR_MS + 60_000,
      },
      bounds,
      maxSpanMs: 10 * HOUR_MS,
      factor: 0.1,
      anchorMs: 5 * HOUR_MS,
    });

    expect(getChartTimeWindowSpanMs(zoomed)).toBe(CHART_MIN_DOMAIN_SPAN_MS);
  });

  it('caps the span at maxSpanMs when zooming out', () => {
    const zoomed = zoomChartTimeWindow({
      visibleWindow,
      bounds,
      maxSpanMs: 2.5 * HOUR_MS,
      factor: 4,
      anchorMs: 5 * HOUR_MS,
    });

    expect(getChartTimeWindowSpanMs(zoomed)).toBe(2.5 * HOUR_MS);
  });

  it('anchors on the window center when the anchor is off-screen', () => {
    const zoomed = zoomChartTimeWindow({
      visibleWindow,
      bounds,
      maxSpanMs: 10 * HOUR_MS,
      factor: 0.5,
      anchorMs: 9.9 * HOUR_MS,
    });

    expect(zoomed).toEqual({ minMs: 4.5 * HOUR_MS, maxMs: 5.5 * HOUR_MS });
  });
});

describe(panChartTimeWindowToTime.name, () => {
  it('centers the window on timeMs using the given anchor ratio', () => {
    const panned = panChartTimeWindowToTime({
      visibleWindow: { minMs: 0, maxMs: 1 * HOUR_MS },
      bounds: { minMs: -100 * HOUR_MS, maxMs: 100 * HOUR_MS },
      timeMs: 5 * HOUR_MS,
      anchorRatio: 0.5,
    });

    expect(panned).toEqual({ minMs: 4.5 * HOUR_MS, maxMs: 5.5 * HOUR_MS });
  });

  it('clamps the panned window to bounds', () => {
    const panned = panChartTimeWindowToTime({
      visibleWindow: { minMs: 0, maxMs: 1 * HOUR_MS },
      bounds,
      timeMs: 20 * HOUR_MS,
      anchorRatio: 0.5,
    });

    expect(panned.maxMs).toBe(bounds.maxMs);
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
    expect(canZoomChartOut({ minMs: 0, maxMs: 1 * HOUR_MS }, 2 * HOUR_MS)).toBe(
      true
    );
    expect(canZoomChartOut({ minMs: 0, maxMs: 2 * HOUR_MS }, 2 * HOUR_MS)).toBe(
      false
    );
  });
});

describe(resolveChartFollowTimeWindow.name, () => {
  const followBounds = { minMs: -100 * HOUR_MS, maxMs: 100 * HOUR_MS };

  it('anchors on now when there is no pending next execution', () => {
    const window = resolveChartFollowTimeWindow({
      visibleWindow: { minMs: -1 * HOUR_MS, maxMs: 1 * HOUR_MS },
      bounds: followBounds,
      nowMs: 0,
    });

    expect(window.maxMs).toBeGreaterThan(0);
    expect(window.minMs).toBeLessThan(0);
  });

  it('pulls the next execution into view when it would otherwise be cut off', () => {
    const window = resolveChartFollowTimeWindow({
      visibleWindow: { minMs: -1 * HOUR_MS, maxMs: 1 * HOUR_MS },
      bounds: followBounds,
      nowMs: 0,
      nextExecutionMs: 1.5 * HOUR_MS,
    });

    expect(window.maxMs).toBeGreaterThanOrEqual(1.5 * HOUR_MS);
    expect(window.minMs).toBeLessThanOrEqual(0);
  });
});
