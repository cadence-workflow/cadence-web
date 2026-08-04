'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  canZoomChartIn,
  canZoomChartOut,
  clampChartVisibleTimeWindow,
  getChartTimeWindowSpanMs,
  isSameChartTimeWindow,
  resolveChartFollowTimeWindow,
  shiftChartTimeWindow,
  zoomChartTimeWindow,
} from '@/views/schedule-details/schedule-details-runs-chart/helpers/chart-view-state';
import {
  CHART_ZOOM_IN_FACTOR,
  CHART_ZOOM_OUT_FACTOR,
} from '@/views/schedule-details/schedule-details-runs-chart/schedule-details-runs-chart.constants';
import { type ChartTimeWindow } from '@/views/schedule-details/schedule-details-runs-chart/schedule-details-runs-chart.types';

import {
  type UseScheduleRunsChartViewStateParams,
  type UseScheduleRunsChartViewStateResult,
} from './use-schedule-runs-chart-view-state.types';

export default function useScheduleRunsChartViewState({
  bounds,
  nowMs,
  nextExecutionMs,
}: UseScheduleRunsChartViewStateParams): UseScheduleRunsChartViewStateResult {
  const [visibleWindow, setVisibleWindow] = useState<ChartTimeWindow | null>(
    null
  );
  const [maxSpanMs, setMaxSpanMs] = useState<number | null>(null);
  const [isFollowing, setIsFollowing] = useState(true);
  const visibleWindowRef = useRef<ChartTimeWindow | null>(null);

  const updateVisibleWindow = useCallback(
    (nextVisibleWindow: ChartTimeWindow | null) => {
      visibleWindowRef.current = nextVisibleWindow;
      setVisibleWindow(nextVisibleWindow);
    },
    []
  );

  useEffect(() => {
    const currentVisibleWindow = visibleWindowRef.current;

    if (!bounds) {
      if (currentVisibleWindow) {
        updateVisibleWindow(null);
      }

      return;
    }

    if (!currentVisibleWindow) {
      return;
    }

    const clampedWindow = clampChartVisibleTimeWindow(
      currentVisibleWindow,
      bounds
    );
    const nextWindow = isFollowing
      ? resolveChartFollowTimeWindow({
          visibleWindow: clampedWindow,
          bounds,
          nowMs,
          nextExecutionMs,
        })
      : clampedWindow;

    if (!isSameChartTimeWindow(nextWindow, currentVisibleWindow)) {
      updateVisibleWindow(nextWindow);
    }
  }, [bounds, isFollowing, nextExecutionMs, nowMs, updateVisibleWindow]);

  const initializeWindow = useCallback(
    (window: ChartTimeWindow, resolvedMaxSpanMs: number) => {
      if (!bounds) {
        updateVisibleWindow(window);
        setMaxSpanMs(resolvedMaxSpanMs);
        return;
      }

      const boundsSpanMs = getChartTimeWindowSpanMs(bounds);
      const clampedWindow = clampChartVisibleTimeWindow(window, bounds);
      const initialWindow = resolveChartFollowTimeWindow({
        visibleWindow: clampedWindow,
        bounds,
        nowMs,
        nextExecutionMs,
      });

      updateVisibleWindow(initialWindow);
      setMaxSpanMs(Math.min(boundsSpanMs, resolvedMaxSpanMs));
    },
    [bounds, nextExecutionMs, nowMs, updateVisibleWindow]
  );

  const zoomBy = useCallback(
    (factor: number) => {
      const currentVisibleWindow = visibleWindowRef.current;

      if (!bounds || !currentVisibleWindow || maxSpanMs == null) {
        return;
      }

      const zoomedWindow = zoomChartTimeWindow({
        visibleWindow: currentVisibleWindow,
        bounds,
        maxSpanMs,
        factor,
        anchorMs: isFollowing
          ? nowMs
          : (currentVisibleWindow.minMs + currentVisibleWindow.maxMs) / 2,
      });

      updateVisibleWindow(
        isFollowing
          ? resolveChartFollowTimeWindow({
              visibleWindow: zoomedWindow,
              bounds,
              nowMs,
              nextExecutionMs,
            })
          : zoomedWindow
      );
    },
    [
      bounds,
      isFollowing,
      maxSpanMs,
      nextExecutionMs,
      nowMs,
      updateVisibleWindow,
    ]
  );

  const zoomIn = useCallback(() => zoomBy(CHART_ZOOM_IN_FACTOR), [zoomBy]);

  const zoomOut = useCallback(() => zoomBy(CHART_ZOOM_OUT_FACTOR), [zoomBy]);

  const goToNow = useCallback(() => {
    const currentVisibleWindow = visibleWindowRef.current;

    setIsFollowing(true);

    if (!bounds || !currentVisibleWindow) {
      return;
    }

    updateVisibleWindow(
      resolveChartFollowTimeWindow({
        visibleWindow: currentVisibleWindow,
        bounds,
        nowMs,
        nextExecutionMs,
      })
    );
  }, [bounds, nextExecutionMs, nowMs, updateVisibleWindow]);

  const panByMs = useCallback(
    (deltaMs: number) => {
      const currentVisibleWindow = visibleWindowRef.current;

      if (!bounds || !currentVisibleWindow) {
        return false;
      }

      const pannedWindow = shiftChartTimeWindow({
        visibleWindow: currentVisibleWindow,
        deltaMs,
        bounds,
      });

      if (isSameChartTimeWindow(pannedWindow, currentVisibleWindow)) {
        return false;
      }

      updateVisibleWindow(pannedWindow);
      setIsFollowing(false);
      return true;
    },
    [bounds, updateVisibleWindow]
  );

  return useMemo(
    () => ({
      visibleWindow,
      isFollowing,
      canZoomIn: visibleWindow ? canZoomChartIn(visibleWindow) : false,
      canZoomOut:
        visibleWindow && maxSpanMs != null
          ? canZoomChartOut(visibleWindow, maxSpanMs)
          : false,
      canPan:
        visibleWindow != null &&
        bounds != null &&
        (visibleWindow.minMs > bounds.minMs ||
          visibleWindow.maxMs < bounds.maxMs),
      initializeWindow,
      zoomIn,
      zoomOut,
      goToNow,
      panByMs,
    }),
    [
      bounds,
      goToNow,
      initializeWindow,
      isFollowing,
      maxSpanMs,
      panByMs,
      visibleWindow,
      zoomIn,
      zoomOut,
    ]
  );
}
