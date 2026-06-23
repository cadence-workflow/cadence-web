import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  canZoomMetricsChartIn,
  canZoomMetricsChartOut,
  clampMetricsChartVisibleDomain,
  createMetricsChartZoomInAction,
  createMetricsChartZoomOutAction,
  isMetricsChartFitAllView,
  panMetricsChartDomainToTime,
} from '../helpers/schedule-detail-metrics-chart-view-state';
import { type MetricsChartTimeDomain } from '../schedule-detail-metrics-chart.types';

export type UseScheduleMetricsChartViewStateParams = {
  fitAllDomain: MetricsChartTimeDomain | null;
  nowMs: number;
};

export type UseScheduleMetricsChartViewStateResult = {
  visibleDomain: MetricsChartTimeDomain | null;
  setVisibleDomain: Dispatch<SetStateAction<MetricsChartTimeDomain | null>>;
  canZoomIn: boolean;
  canZoomOut: boolean;
  isFitAllView: boolean;
  zoomIn: () => void;
  zoomOut: () => void;
  fitAll: () => void;
  goToNow: () => void;
};

export default function useScheduleMetricsChartViewState({
  fitAllDomain,
  nowMs,
}: UseScheduleMetricsChartViewStateParams): UseScheduleMetricsChartViewStateResult {
  const [visibleDomain, setVisibleDomain] =
    useState<MetricsChartTimeDomain | null>(null);

  useEffect(() => {
    if (!fitAllDomain) {
      setVisibleDomain(null);
      return;
    }

    setVisibleDomain((currentVisibleDomain) =>
      currentVisibleDomain
        ? clampMetricsChartVisibleDomain(currentVisibleDomain, fitAllDomain)
        : currentVisibleDomain
    );
  }, [fitAllDomain]);

  const zoomIn = useCallback(() => {
    if (!fitAllDomain || !visibleDomain) {
      return;
    }

    setVisibleDomain(
      createMetricsChartZoomInAction({ visibleDomain, fitAllDomain }, nowMs)
    );
  }, [fitAllDomain, nowMs, visibleDomain]);

  const zoomOut = useCallback(() => {
    if (!fitAllDomain || !visibleDomain) {
      return;
    }

    setVisibleDomain(
      createMetricsChartZoomOutAction({ visibleDomain, fitAllDomain }, nowMs)
    );
  }, [fitAllDomain, nowMs, visibleDomain]);

  const fitAll = useCallback(() => {
    if (!fitAllDomain) {
      return;
    }

    setVisibleDomain(fitAllDomain);
  }, [fitAllDomain]);

  const goToNow = useCallback(() => {
    if (!fitAllDomain || !visibleDomain) {
      return;
    }

    setVisibleDomain(
      panMetricsChartDomainToTime({
        visibleDomain,
        fitAllDomain,
        timeMs: nowMs,
      })
    );
  }, [fitAllDomain, nowMs, visibleDomain]);

  return useMemo(
    () => ({
      visibleDomain,
      setVisibleDomain,
      canZoomIn: visibleDomain ? canZoomMetricsChartIn(visibleDomain) : false,
      canZoomOut:
        visibleDomain && fitAllDomain
          ? canZoomMetricsChartOut(visibleDomain, fitAllDomain)
          : false,
      isFitAllView:
        visibleDomain && fitAllDomain
          ? isMetricsChartFitAllView(visibleDomain, fitAllDomain)
          : false,
      zoomIn,
      zoomOut,
      fitAll,
      goToNow,
    }),
    [fitAll, fitAllDomain, goToNow, visibleDomain, zoomIn, zoomOut]
  );
}
