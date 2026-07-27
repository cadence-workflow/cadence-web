import { act } from '@testing-library/react';

import { renderHook } from '@/test-utils/rtl';

import useScheduleMetricsChartViewState from '../hooks/use-schedule-metrics-chart-view-state';
import {
  CHART_NOW_ANCHOR_RATIO,
  CHART_ZOOM_IN_FACTOR,
} from '../schedule-detail-metrics-chart.constants';

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
const INITIAL_DOMAIN = {
  minMs: MOCK_NOW_MS - INITIAL_SPAN_MS * CHART_NOW_ANCHOR_RATIO,
  maxMs: MOCK_NOW_MS + INITIAL_SPAN_MS * (1 - CHART_NOW_ANCHOR_RATIO),
};

describe(useScheduleMetricsChartViewState.name, () => {
  it('follows the clock from the initial domain', () => {
    const { result, rerender } = setup();

    act(() => {
      result.current.initializeDomain(INITIAL_DOMAIN);
    });

    expect(result.current.isFollowing).toBe(true);

    rerender({ nowMs: MOCK_NOW_MS + 1_000 });

    expect(result.current.visibleDomain).toEqual({
      minMs: INITIAL_DOMAIN.minMs + 1_000,
      maxMs: INITIAL_DOMAIN.maxMs + 1_000,
    });
  });

  it('keeps the next run visible while following', () => {
    const nextExecutionMs = MOCK_NOW_MS + HOUR_MS;
    const { result, rerender } = setup({ nextExecutionMs });

    act(() => {
      result.current.initializeDomain(INITIAL_DOMAIN);
    });

    rerender({ nowMs: MOCK_NOW_MS + 1_000 });

    const visibleDomain = result.current.visibleDomain;

    if (!visibleDomain) {
      throw new Error('Expected a visible domain');
    }

    expect(visibleDomain.maxMs).toBeGreaterThan(nextExecutionMs);
    expect(visibleDomain.minMs).toBeLessThanOrEqual(MOCK_NOW_MS + 1_000);
  });

  it('stops following after a manual pan and resumes on going to now', () => {
    const { result, rerender } = setup();

    act(() => {
      result.current.initializeDomain(INITIAL_DOMAIN);
    });
    act(() => {
      expect(result.current.panByMs(-HOUR_MS)).toBe(true);
    });

    expect(result.current.isFollowing).toBe(false);

    const pannedDomain = result.current.visibleDomain;
    expect(pannedDomain).toEqual({
      minMs: INITIAL_DOMAIN.minMs - HOUR_MS,
      maxMs: INITIAL_DOMAIN.maxMs - HOUR_MS,
    });

    rerender({ nowMs: MOCK_NOW_MS + 1_000 });

    expect(result.current.visibleDomain).toEqual(pannedDomain);

    act(() => {
      result.current.goToNow();
    });

    expect(result.current.isFollowing).toBe(true);

    const followedDomain = result.current.visibleDomain;

    if (!followedDomain) {
      throw new Error('Expected a visible domain');
    }

    const spanMs = followedDomain.maxMs - followedDomain.minMs;
    expect((MOCK_NOW_MS + 1_000 - followedDomain.minMs) / spanMs).toBeCloseTo(
      CHART_NOW_ANCHOR_RATIO,
      5
    );
  });

  it('keeps following when a pan is blocked at the navigation bounds', () => {
    const { result } = setup();

    act(() => {
      result.current.initializeDomain(BOUNDS);
    });
    act(() => {
      expect(result.current.panByMs(-HOUR_MS)).toBe(false);
    });

    expect(result.current.isFollowing).toBe(true);
    expect(result.current.canPan).toBe(false);
    expect(result.current.visibleDomain).toEqual(BOUNDS);
  });

  it('anchors zoom on now while following and on the center afterwards', () => {
    const { result } = setup();

    act(() => {
      result.current.initializeDomain(INITIAL_DOMAIN);
    });
    act(() => {
      result.current.zoomIn();
    });

    const followedZoomDomain = result.current.visibleDomain;

    if (!followedZoomDomain) {
      throw new Error('Expected a visible domain');
    }

    const zoomedSpanMs = INITIAL_SPAN_MS * CHART_ZOOM_IN_FACTOR;
    expect(followedZoomDomain.maxMs - followedZoomDomain.minMs).toBeCloseTo(
      zoomedSpanMs,
      -2
    );
    expect((MOCK_NOW_MS - followedZoomDomain.minMs) / zoomedSpanMs).toBeCloseTo(
      CHART_NOW_ANCHOR_RATIO,
      5
    );

    act(() => {
      result.current.panByMs(-HOUR_MS);
    });

    const pannedDomain = result.current.visibleDomain;

    if (!pannedDomain) {
      throw new Error('Expected a visible domain');
    }

    const pannedCenterMs = (pannedDomain.minMs + pannedDomain.maxMs) / 2;

    act(() => {
      result.current.zoomIn();
    });

    const centeredZoomDomain = result.current.visibleDomain;

    if (!centeredZoomDomain) {
      throw new Error('Expected a visible domain');
    }

    expect(
      (centeredZoomDomain.minMs + centeredZoomDomain.maxMs) / 2
    ).toBeCloseTo(pannedCenterMs, -2);
  });

  it('limits zooming out to two steps beyond the initial readable span', () => {
    const { result } = setup({ bounds: WIDE_BOUNDS });

    act(() => {
      result.current.initializeDomain(INITIAL_DOMAIN);
    });

    expect(result.current.canZoomOut).toBe(true);

    act(() => {
      result.current.zoomOut();
    });

    expect(result.current.canZoomOut).toBe(true);

    act(() => {
      result.current.zoomOut();
    });

    const visibleDomain = result.current.visibleDomain;

    if (!visibleDomain) {
      throw new Error('Expected a visible domain');
    }

    expect(visibleDomain.maxMs - visibleDomain.minMs).toBeCloseTo(
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
      useScheduleMetricsChartViewState({
        bounds,
        nowMs,
        nextExecutionMs,
      }),
    undefined,
    { initialProps: { nowMs: MOCK_NOW_MS } }
  );
}
