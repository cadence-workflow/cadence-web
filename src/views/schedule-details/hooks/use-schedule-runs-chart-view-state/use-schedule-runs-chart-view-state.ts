'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  canZoomChartIn,
  canZoomChartOut,
  clampChartVisibleTimeWindow,
  getChartTimeWindowSpanMs,
  isSameChartTimeWindow,
  resolveChartFollowTimeWindow,
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

/**
 * Owns the chart's visible time window, always live-following `now` (and the
 * next scheduled run, if closer to the edge). Panning away from `now` and
 * resuming with "Now" land in a follow-up change; for now the window simply
 * tracks the clock.
 */
export default function useScheduleRunsChartViewState({
  bounds,
  nowMs,
  nextExecutionMs,
}: UseScheduleRunsChartViewStateParams): UseScheduleRunsChartViewStateResult {
  const [visibleWindow, setVisibleWindow] = useState<ChartTimeWindow | null>(
    null
  );
  const [maxSpanMs, setMaxSpanMs] = useState<number | null>(null);
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
    const nextWindow = resolveChartFollowTimeWindow({
      visibleWindow: clampedWindow,
      bounds,
      nowMs,
      nextExecutionMs,
    });

    if (!isSameChartTimeWindow(nextWindow, currentVisibleWindow)) {
      updateVisibleWindow(nextWindow);
    }
  }, [bounds, nextExecutionMs, nowMs, updateVisibleWindow]);

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
        anchorMs: nowMs,
      });

      updateVisibleWindow(
        resolveChartFollowTimeWindow({
          visibleWindow: zoomedWindow,
          bounds,
          nowMs,
          nextExecutionMs,
        })
      );
    },
    [bounds, maxSpanMs, nextExecutionMs, nowMs, updateVisibleWindow]
  );

  const zoomIn = useCallback(() => zoomBy(CHART_ZOOM_IN_FACTOR), [zoomBy]);

  const zoomOut = useCallback(() => zoomBy(CHART_ZOOM_OUT_FACTOR), [zoomBy]);

  return useMemo(
    () => ({
      visibleWindow,
      canZoomIn: visibleWindow ? canZoomChartIn(visibleWindow) : false,
      canZoomOut:
        visibleWindow && maxSpanMs != null
          ? canZoomChartOut(visibleWindow, maxSpanMs)
          : false,
      initializeWindow,
      zoomIn,
      zoomOut,
    }),
    [initializeWindow, maxSpanMs, visibleWindow, zoomIn, zoomOut]
  );
}
