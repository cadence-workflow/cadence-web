import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  canZoomMetricsChartIn,
  canZoomMetricsChartOut,
  clampMetricsChartVisibleDomain,
  getMetricsChartDomainSpanMs,
  isSameMetricsChartDomain,
  resolveMetricsChartFollowDomain,
  zoomMetricsChartDomain,
} from '../helpers/schedule-detail-metrics-chart-view-state';
import shiftMetricsChartViewDomain from '../helpers/shift-metrics-chart-view-domain';
import {
  CHART_MAX_ZOOM_OUT_STEPS,
  CHART_ZOOM_IN_FACTOR,
  CHART_ZOOM_OUT_FACTOR,
} from '../schedule-detail-metrics-chart.constants';
import { type MetricsChartTimeDomain } from '../schedule-detail-metrics-chart.types';

export type UseScheduleMetricsChartViewStateParams = {
  bounds: MetricsChartTimeDomain | null;
  nowMs: number;
  nextExecutionMs?: number | null;
};

export type UseScheduleMetricsChartViewStateResult = {
  visibleDomain: MetricsChartTimeDomain | null;
  isFollowing: boolean;
  canZoomIn: boolean;
  canZoomOut: boolean;
  canPan: boolean;
  initializeDomain: (domain: MetricsChartTimeDomain) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  goToNow: () => void;
  panByMs: (deltaMs: number) => boolean;
};

export default function useScheduleMetricsChartViewState({
  bounds,
  nowMs,
  nextExecutionMs,
}: UseScheduleMetricsChartViewStateParams): UseScheduleMetricsChartViewStateResult {
  const [visibleDomain, setVisibleDomain] =
    useState<MetricsChartTimeDomain | null>(null);
  const [maxSpanMs, setMaxSpanMs] = useState<number | null>(null);
  const [isFollowing, setIsFollowing] = useState(true);
  const visibleDomainRef = useRef<MetricsChartTimeDomain | null>(null);

  const updateVisibleDomain = useCallback(
    (nextVisibleDomain: MetricsChartTimeDomain | null) => {
      visibleDomainRef.current = nextVisibleDomain;
      setVisibleDomain(nextVisibleDomain);
    },
    []
  );

  useEffect(() => {
    const currentVisibleDomain = visibleDomainRef.current;

    if (!bounds) {
      if (currentVisibleDomain) {
        updateVisibleDomain(null);
      }

      return;
    }

    if (!currentVisibleDomain) {
      return;
    }

    const clampedDomain = clampMetricsChartVisibleDomain(
      currentVisibleDomain,
      bounds
    );

    if (!isSameMetricsChartDomain(clampedDomain, currentVisibleDomain)) {
      updateVisibleDomain(clampedDomain);
    }
  }, [bounds, updateVisibleDomain]);

  useEffect(() => {
    const currentVisibleDomain = visibleDomainRef.current;

    if (!bounds || !currentVisibleDomain || !isFollowing) {
      return;
    }

    const followDomain = resolveMetricsChartFollowDomain({
      visibleDomain: currentVisibleDomain,
      bounds,
      nowMs,
      nextExecutionMs,
    });

    if (!isSameMetricsChartDomain(followDomain, currentVisibleDomain)) {
      updateVisibleDomain(followDomain);
    }
  }, [bounds, isFollowing, nextExecutionMs, nowMs, updateVisibleDomain]);

  const initializeDomain = useCallback(
    (domain: MetricsChartTimeDomain) => {
      const initialDomain = bounds
        ? clampMetricsChartVisibleDomain(domain, bounds)
        : domain;

      updateVisibleDomain(initialDomain);
      const initialSpanMs = getMetricsChartDomainSpanMs(initialDomain);
      setMaxSpanMs(
        bounds
          ? Math.min(
              getMetricsChartDomainSpanMs(bounds),
              initialSpanMs * CHART_ZOOM_OUT_FACTOR ** CHART_MAX_ZOOM_OUT_STEPS
            )
          : initialSpanMs
      );
    },
    [bounds, updateVisibleDomain]
  );

  const zoomBy = useCallback(
    (factor: number) => {
      const currentVisibleDomain = visibleDomainRef.current;

      if (!bounds || !currentVisibleDomain || maxSpanMs == null) {
        return;
      }

      const zoomedDomain = zoomMetricsChartDomain({
        visibleDomain: currentVisibleDomain,
        bounds,
        maxSpanMs,
        factor,
        anchorMs: isFollowing
          ? nowMs
          : (currentVisibleDomain.minMs + currentVisibleDomain.maxMs) / 2,
      });

      updateVisibleDomain(
        isFollowing
          ? resolveMetricsChartFollowDomain({
              visibleDomain: zoomedDomain,
              bounds,
              nowMs,
              nextExecutionMs,
            })
          : zoomedDomain
      );
    },
    [
      bounds,
      isFollowing,
      maxSpanMs,
      nextExecutionMs,
      nowMs,
      updateVisibleDomain,
    ]
  );

  const zoomIn = useCallback(() => zoomBy(CHART_ZOOM_IN_FACTOR), [zoomBy]);

  const zoomOut = useCallback(() => zoomBy(CHART_ZOOM_OUT_FACTOR), [zoomBy]);

  const goToNow = useCallback(() => {
    const currentVisibleDomain = visibleDomainRef.current;

    setIsFollowing(true);

    if (!bounds || !currentVisibleDomain) {
      return;
    }

    updateVisibleDomain(
      resolveMetricsChartFollowDomain({
        visibleDomain: currentVisibleDomain,
        bounds,
        nowMs,
        nextExecutionMs,
      })
    );
  }, [bounds, nextExecutionMs, nowMs, updateVisibleDomain]);

  const panByMs = useCallback(
    (deltaMs: number) => {
      const currentVisibleDomain = visibleDomainRef.current;

      if (!bounds || !currentVisibleDomain) {
        return false;
      }

      const pannedDomain = shiftMetricsChartViewDomain({
        viewDomain: currentVisibleDomain,
        deltaMs,
        bounds,
      });

      if (isSameMetricsChartDomain(pannedDomain, currentVisibleDomain)) {
        return false;
      }

      updateVisibleDomain(pannedDomain);
      setIsFollowing(false);
      return true;
    },
    [bounds, updateVisibleDomain]
  );

  return useMemo(
    () => ({
      visibleDomain,
      isFollowing,
      canZoomIn: visibleDomain ? canZoomMetricsChartIn(visibleDomain) : false,
      canZoomOut:
        visibleDomain && maxSpanMs != null
          ? canZoomMetricsChartOut(visibleDomain, maxSpanMs)
          : false,
      canPan:
        visibleDomain != null &&
        bounds != null &&
        (visibleDomain.minMs > bounds.minMs ||
          visibleDomain.maxMs < bounds.maxMs),
      initializeDomain,
      zoomIn,
      zoomOut,
      goToNow,
      panByMs,
    }),
    [
      bounds,
      goToNow,
      initializeDomain,
      isFollowing,
      maxSpanMs,
      panByMs,
      visibleDomain,
      zoomIn,
      zoomOut,
    ]
  );
}
