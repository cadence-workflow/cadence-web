import { act } from '@testing-library/react';

import { renderHook } from '@/test-utils/rtl';

import {
  CHART_NOW_ANCHOR_RATIO,
  CHART_ZOOM_IN_FACTOR,
  CHART_ZOOM_OUT_FACTOR,
} from '@/views/schedule-details/schedule-details-runs-chart/schedule-details-runs-chart.constants';

import useScheduleRunsChartViewState from '../use-schedule-runs-chart-view-state';

const hourMs = 60 * 60 * 1000;
const mockNowMs = new Date('2024-06-15T12:00:00Z').getTime();
const defaultBounds = {
  minMs: mockNowMs - 12 * hourMs,
  maxMs: mockNowMs + 4 * hourMs,
};
const wideBounds = {
  minMs: mockNowMs - 28 * hourMs,
  maxMs: mockNowMs + 4 * hourMs,
};
const initialSpanMs = 4 * hourMs;
const initialWindow = {
  minMs: mockNowMs - initialSpanMs * CHART_NOW_ANCHOR_RATIO,
  maxMs: mockNowMs + initialSpanMs * (1 - CHART_NOW_ANCHOR_RATIO),
};
const generousMaxSpanMs = 100 * hourMs;

describe(useScheduleRunsChartViewState.name, () => {
  it('follows the clock from the initial window', () => {
    const { result, rerender } = setup();

    act(() => {
      result.current.initializeWindow(initialWindow, generousMaxSpanMs);
    });

    expect(result.current.isFollowing).toBe(true);

    rerender({ nowMs: mockNowMs + 1_000, bounds: defaultBounds });

    expect(result.current.visibleWindow).toEqual({
      minMs: initialWindow.minMs + 1_000,
      maxMs: initialWindow.maxMs + 1_000,
    });
  });

  it('keeps the next run visible while following', () => {
    const nextExecutionMs = mockNowMs + hourMs;
    const { result, rerender } = setup({ nextExecutionMs });

    act(() => {
      result.current.initializeWindow(initialWindow, generousMaxSpanMs);
    });

    rerender({ nowMs: mockNowMs + 1_000, bounds: defaultBounds });

    const visibleWindow = result.current.visibleWindow;

    if (!visibleWindow) {
      throw new Error('Expected a visible window');
    }

    expect(visibleWindow.maxMs).toBeGreaterThan(nextExecutionMs);
    expect(visibleWindow.minMs).toBeLessThanOrEqual(mockNowMs + 1_000);
  });

  it('stops following after a manual pan and resumes on going to now', () => {
    const { result, rerender } = setup();

    act(() => {
      result.current.initializeWindow(initialWindow, generousMaxSpanMs);
    });
    act(() => {
      expect(result.current.panByMs(-hourMs)).toBe(true);
    });

    expect(result.current.isFollowing).toBe(false);

    const pannedWindow = result.current.visibleWindow;
    expect(pannedWindow).toEqual({
      minMs: initialWindow.minMs - hourMs,
      maxMs: initialWindow.maxMs - hourMs,
    });

    rerender({ nowMs: mockNowMs + 1_000, bounds: defaultBounds });

    expect(result.current.visibleWindow).toEqual(pannedWindow);

    act(() => {
      result.current.goToNow();
    });

    expect(result.current.isFollowing).toBe(true);

    const followedWindow = result.current.visibleWindow;

    if (!followedWindow) {
      throw new Error('Expected a visible window');
    }

    const spanMs = followedWindow.maxMs - followedWindow.minMs;
    expect((mockNowMs + 1_000 - followedWindow.minMs) / spanMs).toBeCloseTo(
      CHART_NOW_ANCHOR_RATIO,
      5
    );
  });

  it('blocks pans that would move past the navigation bounds', () => {
    const { result } = setup();

    act(() => {
      result.current.initializeWindow(initialWindow, generousMaxSpanMs);
    });
    act(() => {
      result.current.panByMs(-(12 * hourMs));
    });

    expect(result.current.visibleWindow?.minMs).toBe(defaultBounds.minMs);

    act(() => {
      expect(result.current.panByMs(-hourMs)).toBe(false);
    });
  });

  it('anchors zoom on now while following and on the center afterwards', () => {
    const { result } = setup();

    act(() => {
      result.current.initializeWindow(initialWindow, generousMaxSpanMs);
    });
    act(() => {
      result.current.zoomIn();
    });

    const followedZoomWindow = result.current.visibleWindow;

    if (!followedZoomWindow) {
      throw new Error('Expected a visible window');
    }

    const zoomedSpanMs = initialSpanMs * CHART_ZOOM_IN_FACTOR;
    expect(followedZoomWindow.maxMs - followedZoomWindow.minMs).toBeCloseTo(
      zoomedSpanMs,
      -2
    );
    expect((mockNowMs - followedZoomWindow.minMs) / zoomedSpanMs).toBeCloseTo(
      CHART_NOW_ANCHOR_RATIO,
      5
    );

    act(() => {
      result.current.panByMs(-hourMs);
    });

    const pannedWindow = result.current.visibleWindow;

    if (!pannedWindow) {
      throw new Error('Expected a visible window');
    }

    const pannedCenterMs = (pannedWindow.minMs + pannedWindow.maxMs) / 2;

    act(() => {
      result.current.zoomIn();
    });

    const centeredZoomWindow = result.current.visibleWindow;

    if (!centeredZoomWindow) {
      throw new Error('Expected a visible window');
    }

    expect(
      (centeredZoomWindow.minMs + centeredZoomWindow.maxMs) / 2
    ).toBeCloseTo(pannedCenterMs, -2);
  });

  it('anchors now on initialization even when bounds clamp the window', () => {
    const tightBounds = {
      minMs: mockNowMs - 12 * hourMs,
      maxMs: mockNowMs + hourMs,
    };
    const { result } = setup({ bounds: tightBounds });

    act(() => {
      result.current.initializeWindow(initialWindow, generousMaxSpanMs);
    });

    const visibleWindow = result.current.visibleWindow;

    if (!visibleWindow) {
      throw new Error('Expected a visible window');
    }

    const spanMs = visibleWindow.maxMs - visibleWindow.minMs;

    expect((mockNowMs - visibleWindow.minMs) / spanMs).toBeCloseTo(
      CHART_NOW_ANCHOR_RATIO,
      5
    );
  });

  it('does not jump when navigation bounds expand while following', () => {
    const { result, rerender } = setup();

    act(() => {
      result.current.initializeWindow(initialWindow, generousMaxSpanMs);
    });

    const initialVisibleWindow = result.current.visibleWindow;

    rerender({ bounds: wideBounds, nowMs: mockNowMs });

    expect(result.current.visibleWindow).toEqual(initialVisibleWindow);
  });

  it('stops zooming out at the resolved overlap span', () => {
    const maxSpanMs = initialSpanMs * CHART_ZOOM_OUT_FACTOR;
    const { result } = setup({ bounds: wideBounds });

    act(() => {
      result.current.initializeWindow(initialWindow, maxSpanMs);
    });

    expect(result.current.canZoomOut).toBe(true);

    act(() => {
      result.current.zoomOut();
    });

    const visibleWindow = result.current.visibleWindow;

    if (!visibleWindow) {
      throw new Error('Expected a visible window');
    }

    expect(visibleWindow.maxMs - visibleWindow.minMs).toBeCloseTo(
      maxSpanMs,
      -2
    );
    expect(result.current.canZoomOut).toBe(false);
  });
});

function setup({
  bounds = defaultBounds,
  nextExecutionMs,
}: {
  bounds?: typeof defaultBounds;
  nextExecutionMs?: number;
} = {}) {
  return renderHook(
    (
      {
        nowMs,
        bounds: hookBounds,
      }: {
        nowMs: number;
        bounds: typeof defaultBounds;
      } = { nowMs: mockNowMs, bounds: defaultBounds }
    ) =>
      useScheduleRunsChartViewState({
        bounds: hookBounds,
        nowMs,
        nextExecutionMs,
      }),
    undefined,
    { initialProps: { nowMs: mockNowMs, bounds } }
  );
}
