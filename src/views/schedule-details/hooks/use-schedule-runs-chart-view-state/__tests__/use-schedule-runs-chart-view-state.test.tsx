import { act } from '@testing-library/react';

import { renderHook } from '@/test-utils/rtl';

import {
  CHART_NOW_ANCHOR_RATIO,
  CHART_ZOOM_IN_FACTOR,
} from '@/views/schedule-details/schedule-details-runs-chart/schedule-details-runs-chart.constants';

import useScheduleRunsChartViewState from '../use-schedule-runs-chart-view-state';

const HOUR_MS = 60 * 60 * 1000;
const MOCK_NOW_MS = new Date('2024-06-15T12:00:00Z').getTime();
const BOUNDS = {
  minMs: MOCK_NOW_MS - 12 * HOUR_MS,
  maxMs: MOCK_NOW_MS + 4 * HOUR_MS,
};
const WIDE_BOUNDS = {
  minMs: MOCK_NOW_MS - 28 * HOUR_MS,
  maxMs: MOCK_NOW_MS + 4 * HOUR_MS,
};
const INITIAL_SPAN_MS = 4 * HOUR_MS;
const INITIAL_WINDOW = {
  minMs: MOCK_NOW_MS - INITIAL_SPAN_MS * CHART_NOW_ANCHOR_RATIO,
  maxMs: MOCK_NOW_MS + INITIAL_SPAN_MS * (1 - CHART_NOW_ANCHOR_RATIO),
};

describe(useScheduleRunsChartViewState.name, () => {
  it('follows the clock from the initial window', () => {
    const { result, rerender } = setup();

    act(() => {
      result.current.initializeWindow(INITIAL_WINDOW);
    });

    expect(result.current.isFollowing).toBe(true);

    rerender({ nowMs: MOCK_NOW_MS + 1_000 });

    expect(result.current.visibleWindow).toEqual({
      minMs: INITIAL_WINDOW.minMs + 1_000,
      maxMs: INITIAL_WINDOW.maxMs + 1_000,
    });
  });

  it('keeps the next run visible while following', () => {
    const nextExecutionMs = MOCK_NOW_MS + HOUR_MS;
    const { result, rerender } = setup({ nextExecutionMs });

    act(() => {
      result.current.initializeWindow(INITIAL_WINDOW);
    });

    rerender({ nowMs: MOCK_NOW_MS + 1_000 });

    const visibleWindow = result.current.visibleWindow;

    if (!visibleWindow) {
      throw new Error('Expected a visible window');
    }

    expect(visibleWindow.maxMs).toBeGreaterThan(nextExecutionMs);
    expect(visibleWindow.minMs).toBeLessThanOrEqual(MOCK_NOW_MS + 1_000);
  });

  it('stops following after a manual pan and resumes on going to now', () => {
    const { result, rerender } = setup();

    act(() => {
      result.current.initializeWindow(INITIAL_WINDOW);
    });
    act(() => {
      expect(result.current.panByMs(-HOUR_MS)).toBe(true);
    });

    expect(result.current.isFollowing).toBe(false);

    const pannedWindow = result.current.visibleWindow;
    expect(pannedWindow).toEqual({
      minMs: INITIAL_WINDOW.minMs - HOUR_MS,
      maxMs: INITIAL_WINDOW.maxMs - HOUR_MS,
    });

    rerender({ nowMs: MOCK_NOW_MS + 1_000 });

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
    expect((MOCK_NOW_MS + 1_000 - followedWindow.minMs) / spanMs).toBeCloseTo(
      CHART_NOW_ANCHOR_RATIO,
      5
    );
  });

  it('keeps following when a pan is blocked at the navigation bounds', () => {
    const { result } = setup();

    act(() => {
      result.current.initializeWindow(BOUNDS);
    });
    act(() => {
      expect(result.current.panByMs(-HOUR_MS)).toBe(false);
    });

    expect(result.current.isFollowing).toBe(true);
    expect(result.current.canPan).toBe(false);
    expect(result.current.visibleWindow).toEqual(BOUNDS);
  });

  it('anchors zoom on now while following and on the center afterwards', () => {
    const { result } = setup();

    act(() => {
      result.current.initializeWindow(INITIAL_WINDOW);
    });
    act(() => {
      result.current.zoomIn();
    });

    const followedZoomWindow = result.current.visibleWindow;

    if (!followedZoomWindow) {
      throw new Error('Expected a visible window');
    }

    const zoomedSpanMs = INITIAL_SPAN_MS * CHART_ZOOM_IN_FACTOR;
    expect(followedZoomWindow.maxMs - followedZoomWindow.minMs).toBeCloseTo(
      zoomedSpanMs,
      -2
    );
    expect((MOCK_NOW_MS - followedZoomWindow.minMs) / zoomedSpanMs).toBeCloseTo(
      CHART_NOW_ANCHOR_RATIO,
      5
    );

    act(() => {
      result.current.panByMs(-HOUR_MS);
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

  it('limits zooming out to two steps beyond the initial readable span', () => {
    const { result } = setup({ bounds: WIDE_BOUNDS });

    act(() => {
      result.current.initializeWindow(INITIAL_WINDOW);
    });

    expect(result.current.canZoomOut).toBe(true);

    act(() => {
      result.current.zoomOut();
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
      INITIAL_SPAN_MS * 4,
      -2
    );
    expect(result.current.canZoomOut).toBe(false);
  });
});

function setup({
  bounds = BOUNDS,
  nextExecutionMs,
}: {
  bounds?: typeof BOUNDS;
  nextExecutionMs?: number;
} = {}) {
  return renderHook(
    ({ nowMs }: { nowMs: number } = { nowMs: MOCK_NOW_MS }) =>
      useScheduleRunsChartViewState({
        bounds,
        nowMs,
        nextExecutionMs,
      }),
    undefined,
    { initialProps: { nowMs: MOCK_NOW_MS } }
  );
}
