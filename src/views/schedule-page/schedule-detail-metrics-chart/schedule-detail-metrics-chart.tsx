'use client';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useParentSize } from '@visx/responsive';
import { Spinner } from 'baseui/spinner';
import {
  MdGpsFixed,
  MdReportGmailerrorred,
  MdZoomIn,
  MdZoomOut,
} from 'react-icons/md';

import Button from '@/components/button/button';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import useListWorkflowsForSchedule from '@/views/schedule-details/hooks/use-list-workflows-for-schedule/use-list-workflows-for-schedule';
import useDescribeSchedule from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule';
import useDomainDescription from '@/views/shared/hooks/use-domain-description/use-domain-description';

import describeScheduleToNextExecutionMs from './helpers/describe-schedule-to-next-execution';
import filterExecutionsBeforeNextExecution from './helpers/filter-executions-before-next-execution';
import filterExecutionsToVisibleDomain from './helpers/filter-executions-to-visible-domain';
import {
  getDomainRetentionSeconds,
  getLatestExpectedScheduleTimesMs,
  getScheduleIntervalAfterMs,
  getScheduleJitterMs,
  getScheduleTimelineBounds,
} from './helpers/get-schedule-cron-timeline';
import { getScheduleMetricsChartStatus } from './helpers/get-schedule-metrics-chart-status';
import getSkippedScheduleExecutions from './helpers/get-skipped-schedule-executions';
import hasScheduleMetricsChartData from './helpers/has-schedule-metrics-chart-data';
import resolveInitialMetricsChartViewDomain from './helpers/resolve-initial-metrics-chart-view-domain';
import workflowsForScheduleToChartPoints, {
  getOldestLoadedScheduleTimeMs,
} from './helpers/workflows-for-schedule-to-chart-points';
import useCurrentTimeMs from './hooks/use-current-time-ms';
import useNewChartTimesMs from './hooks/use-new-chart-times-ms';
import useScheduleMetricsChartViewState from './hooks/use-schedule-metrics-chart-view-state';
import ScheduleDetailMetricsChartGlyph from './schedule-detail-metrics-chart-glyph';
import ScheduleDetailMetricsChartLoading from './schedule-detail-metrics-chart-loading';
import {
  createMetricsChartXScale,
  resolveMetricsChartPixelRange,
  resolveMetricsChartTimeDomain,
} from './schedule-detail-metrics-chart-scales';
import ScheduleDetailMetricsChartSeries from './schedule-detail-metrics-chart-series';
import ScheduleDetailMetricsChartStatusIcon from './schedule-detail-metrics-chart-status-icon';
import {
  CHART_CANVAS_TEST_ID,
  CHART_EMPTY_STATE_MESSAGE,
  CHART_FETCH_LOADING_MESSAGE,
  CHART_FETCH_LOADING_SPINNER_SIZE_PX,
  CHART_FETCH_LOADING_TEST_ID,
  CHART_FETCH_RETRY_ICON_SIZE_PX,
  CHART_FETCH_RETRY_LABEL,
  CHART_FUTURE_GUTTER_MS,
  CHART_GLYPH_TEST_IDS,
  CHART_HEIGHT_PX,
  CHART_LEGEND_ICON_SIZE_PX,
  CHART_LEGEND_ITEMS,
  CHART_LEGEND_TITLE,
  CHART_LIVE_REFRESH_INTERVAL_MS,
  CHART_PAN_FETCH_EDGE_THRESHOLD_RATIO,
  CHART_REGION_ARIA_LABEL,
  CHART_SERIES_TEST_IDS,
  CHART_SERIES_TIMELINE_Y_PX,
  CHART_SUMMARY_TEST_ID,
  CHART_TOOLBAR_ARIA_LABEL,
  CHART_TOOLBAR_BUTTON_LABELS,
  CHART_TOOLBAR_ICON_SIZE_PX,
  CHART_WORKFLOWS_PAGE_SIZE,
  CHART_WORKFLOWS_REFRESH_INTERVAL_MS,
} from './schedule-detail-metrics-chart.constants';
import { overrides, styled } from './schedule-detail-metrics-chart.styles';
import {
  type MetricsChartTimeDomain,
  type Props,
} from './schedule-detail-metrics-chart.types';

export default function ScheduleDetailMetricsChart({ params }: Props) {
  const { domain, cluster, scheduleId } = params;
  const { theme } = useStyletronClasses({});
  const [isPanning, setIsPanning] = useState(false);
  const lastPanClientXRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const {
    parentRef: chartRegionRef,
    width: measuredWidth,
    height: measuredHeight,
  } = useParentSize({ initialSize: { width: 0, height: CHART_HEIGHT_PX } });
  const chartWidth = Math.max(measuredWidth, 0);
  const chartHeight = Math.max(measuredHeight, 0);

  const describeQuery = useDescribeSchedule({
    domain,
    cluster,
    scheduleId,
    runningScheduleRefetchIntervalMs: CHART_LIVE_REFRESH_INTERVAL_MS,
  });
  const workflowsQuery = useListWorkflowsForSchedule({
    domain,
    cluster,
    scheduleId,
    pageSize: CHART_WORKFLOWS_PAGE_SIZE,
    refetchIntervalMs: CHART_WORKFLOWS_REFRESH_INTERVAL_MS,
    runsRevision: describeQuery.data?.info?.totalRuns,
  });
  const domainQuery = useDomainDescription({ domain, cluster });
  const fetchNextWorkflowPage = workflowsQuery.fetchNextPage;
  const workflowPageCount = workflowsQuery.data?.pages.length;
  const nowMs = useCurrentTimeMs();
  const cronEvaluationTimeMs = Math.floor(nowMs / 60_000) * 60_000;

  const chartPoints = useMemo(
    () => workflowsForScheduleToChartPoints(workflowsQuery.data),
    [workflowsQuery.data]
  );

  const nextExecutionTimeMs = useMemo(
    () => describeScheduleToNextExecutionMs(describeQuery.data),
    [describeQuery.data]
  );

  const oldestLoadedScheduleTimeMs = useMemo(
    () => getOldestLoadedScheduleTimeMs(workflowsQuery.data),
    [workflowsQuery.data]
  );
  const retentionSeconds = getDomainRetentionSeconds(
    domainQuery.data?.workflowExecutionRetentionPeriod
  );
  const timelineBounds = useMemo(
    () =>
      getScheduleTimelineBounds({
        describeSchedule: describeQuery.data,
        retentionSeconds,
        nowMs: cronEvaluationTimeMs,
      }),
    [cronEvaluationTimeMs, describeQuery.data, retentionSeconds]
  );
  const cronExpression = describeQuery.data?.spec?.cronExpression ?? '';
  // Depend on the jitter value rather than the polled response object, so
  // re-expanding the cron timeline is driven by real changes only.
  const jitterMs = getScheduleJitterMs(describeQuery.data);
  const skippedExecutions = useMemo(
    () =>
      getSkippedScheduleExecutions({
        cronExpression,
        inferenceStartMs: timelineBounds.inferenceStartMs,
        scheduleEndMs: timelineBounds.scheduleEndMs,
        oldestLoadedScheduleTimeMs,
        hasNextPage: workflowsQuery.hasNextPage,
        nowMs: cronEvaluationTimeMs,
        nextExecutionTimeMs,
        jitterMs,
        actualExecutions: chartPoints.successfulRuns,
      }),
    [
      chartPoints.successfulRuns,
      cronEvaluationTimeMs,
      cronExpression,
      jitterMs,
      oldestLoadedScheduleTimeMs,
      nextExecutionTimeMs,
      timelineBounds.inferenceStartMs,
      timelineBounds.scheduleEndMs,
      workflowsQuery.hasNextPage,
    ]
  );
  const chartData = useMemo(
    () => ({
      successfulRuns: filterExecutionsBeforeNextExecution(
        chartPoints.successfulRuns,
        nextExecutionTimeMs
      ),
      skippedExecutions: filterExecutionsBeforeNextExecution(
        skippedExecutions,
        nextExecutionTimeMs
      ),
      nextExecutionTimeMs,
    }),
    [chartPoints, nextExecutionTimeMs, skippedExecutions]
  );
  const chartTimesMs = useMemo(
    () => ({
      runs: chartData.successfulRuns.map(
        ({ scheduledTimeMs }) => scheduledTimeMs
      ),
      skipped: chartData.skippedExecutions.map(
        ({ scheduledTimeMs }) => scheduledTimeMs
      ),
      next:
        chartData.nextExecutionTimeMs == null
          ? []
          : [chartData.nextExecutionTimeMs],
    }),
    [chartData]
  );
  const timestampsMs = useMemo(
    () => [...chartTimesMs.runs, ...chartTimesMs.skipped],
    [chartTimesMs]
  );
  const latestExpectedTimesMs = useMemo(
    () =>
      getLatestExpectedScheduleTimesMs({
        cronExpression,
        anchorMs: Math.max(
          nextExecutionTimeMs ?? cronEvaluationTimeMs,
          cronEvaluationTimeMs
        ),
        startMs: timelineBounds.inferenceStartMs,
      }),
    [
      cronEvaluationTimeMs,
      cronExpression,
      nextExecutionTimeMs,
      timelineBounds.inferenceStartMs,
    ]
  );
  const futureGutterMs = useMemo(
    () =>
      getScheduleIntervalAfterMs({
        cronExpression,
        occurrenceMs: nextExecutionTimeMs ?? cronEvaluationTimeMs,
      }) ?? CHART_FUTURE_GUTTER_MS,
    [cronEvaluationTimeMs, cronExpression, nextExecutionTimeMs]
  );

  const isInitialLoading =
    describeQuery.isLoading ||
    domainQuery.isLoading ||
    workflowsQuery.isLoading;
  const newRunTimesMs = useNewChartTimesMs({
    timesMs: chartTimesMs.runs,
    isEnabled: !isInitialLoading,
  });
  const newSkippedTimesMs = useNewChartTimesMs({
    timesMs: chartTimesMs.skipped,
    isEnabled: !isInitialLoading,
  });
  const newNextTimesMs = useNewChartTimesMs({
    timesMs: chartTimesMs.next,
    isEnabled: !isInitialLoading,
  });
  const isFetchingMore = workflowsQuery.isFetchingNextPage;
  const isFetchMoreError = workflowsQuery.isFetchNextPageError;
  const showFetchMoreError = isFetchMoreError && !isFetchingMore;

  const loadedTimeDomain = useMemo(
    () =>
      resolveMetricsChartTimeDomain({
        timestampsMs,
        nowMs,
        nextExecutionMs: nextExecutionTimeMs,
        futureGutterMs,
        minimumTimeMs: timelineBounds.navigationStartMs,
      }),
    [
      futureGutterMs,
      nextExecutionTimeMs,
      nowMs,
      timelineBounds.navigationStartMs,
      timestampsMs,
    ]
  );

  const navigationBounds = useMemo(
    () =>
      loadedTimeDomain
        ? {
            minMs: Math.min(
              timelineBounds.navigationStartMs ?? loadedTimeDomain.minMs,
              loadedTimeDomain.minMs
            ),
            maxMs: loadedTimeDomain.maxMs,
          }
        : null,
    [loadedTimeDomain, timelineBounds.navigationStartMs]
  );

  const {
    visibleDomain,
    isFollowing,
    canZoomIn,
    canZoomOut,
    canPan,
    initializeDomain,
    zoomIn,
    zoomOut,
    goToNow,
    panByMs,
  } = useScheduleMetricsChartViewState({
    bounds: navigationBounds,
    nowMs,
    nextExecutionMs: nextExecutionTimeMs,
  });

  // Initialization waits for the first non-zero measurement, so the starting
  // zoom can be chosen from how many runs actually fit on screen.
  useEffect(() => {
    if (
      visibleDomain != null ||
      isInitialLoading ||
      navigationBounds == null ||
      chartWidth <= 0
    ) {
      return;
    }

    initializeDomain(
      resolveInitialMetricsChartViewDomain({
        nowMs,
        chartWidthPx: chartWidth,
        nextExecutionMs: nextExecutionTimeMs,
        timestampsMs,
        expectedTimesMs: latestExpectedTimesMs,
        futureGutterMs,
      })
    );
  }, [
    chartWidth,
    futureGutterMs,
    initializeDomain,
    isInitialLoading,
    latestExpectedTimesMs,
    navigationBounds,
    nextExecutionTimeMs,
    nowMs,
    timestampsMs,
    visibleDomain,
  ]);

  const shouldFetchOlderWorkflows = useCallback(
    (domain: MetricsChartTimeDomain | null) => {
      if (
        domain == null ||
        !workflowsQuery.hasNextPage ||
        workflowsQuery.isFetchingNextPage ||
        workflowsQuery.isFetchNextPageError
      ) {
        return false;
      }

      if (oldestLoadedScheduleTimeMs == null) {
        return true;
      }

      const viewSpanMs = domain.maxMs - domain.minMs;
      const fetchThresholdMs =
        domain.minMs + viewSpanMs * CHART_PAN_FETCH_EDGE_THRESHOLD_RATIO;

      return oldestLoadedScheduleTimeMs > fetchThresholdMs;
    },
    [
      oldestLoadedScheduleTimeMs,
      workflowsQuery.hasNextPage,
      workflowsQuery.isFetchNextPageError,
      workflowsQuery.isFetchingNextPage,
    ]
  );

  useEffect(() => {
    if (!shouldFetchOlderWorkflows(visibleDomain)) {
      return;
    }

    void fetchNextWorkflowPage();
  }, [
    visibleDomain,
    shouldFetchOlderWorkflows,
    fetchNextWorkflowPage,
    workflowPageCount,
  ]);

  const panByClientDelta = useCallback(
    (deltaClientX: number) => {
      if (chartWidth <= 0 || visibleDomain == null) {
        return false;
      }

      const viewSpanMs = visibleDomain.maxMs - visibleDomain.minMs;

      return panByMs(-(deltaClientX / chartWidth) * viewSpanMs);
    },
    [chartWidth, panByMs, visibleDomain]
  );

  const handlePanStart = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || visibleDomain == null || !canPan) {
        return;
      }

      // Keeps the drag from selecting the timeline labels underneath.
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      lastPanClientXRef.current = event.clientX;
      setIsPanning(true);
    },
    [canPan, visibleDomain]
  );

  useEffect(() => {
    if (!isPanning) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const lastPanClientX = lastPanClientXRef.current;

      if (lastPanClientX == null) {
        return;
      }

      lastPanClientXRef.current = event.clientX;
      panByClientDelta(event.clientX - lastPanClientX);
    };

    const handlePointerUp = () => {
      lastPanClientXRef.current = null;
      setIsPanning(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isPanning, panByClientDelta]);

  // Native listener so the gesture can stay scrollable at the chart edges:
  // React attaches `onWheel` passively, where `preventDefault` has no effect.
  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas == null || visibleDomain == null) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      const horizontalDelta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      const viewSpanMs = visibleDomain.maxMs - visibleDomain.minMs;

      if (panByMs((horizontalDelta / (chartWidth || 1)) * viewSpanMs)) {
        event.preventDefault();
      }
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [chartWidth, panByMs, visibleDomain]);

  const hasRenderableChartData =
    hasScheduleMetricsChartData(chartData) || describeQuery.isSuccess;

  const toolbarEnabled =
    hasRenderableChartData && visibleDomain != null && !isInitialLoading;

  const xScale = useMemo(() => {
    const pixelRange = resolveMetricsChartPixelRange({ widthPx: chartWidth });

    if (pixelRange == null || visibleDomain == null) {
      return null;
    }

    return createMetricsChartXScale({
      domain: visibleDomain,
      range: pixelRange,
    });
  }, [chartWidth, visibleDomain]);

  const visibleRuns = useMemo(
    () =>
      filterExecutionsToVisibleDomain(chartData.successfulRuns, visibleDomain),
    [chartData.successfulRuns, visibleDomain]
  );
  const visibleSkippedExecutions = useMemo(
    () =>
      filterExecutionsToVisibleDomain(
        chartData.skippedExecutions,
        visibleDomain
      ),
    [chartData.skippedExecutions, visibleDomain]
  );

  const isNextExecutionVisible =
    visibleDomain != null &&
    chartData.nextExecutionTimeMs != null &&
    chartData.nextExecutionTimeMs >= visibleDomain.minMs &&
    chartData.nextExecutionTimeMs <= visibleDomain.maxMs;

  const canRenderSeries =
    !isInitialLoading &&
    hasRenderableChartData &&
    chartHeight > 0 &&
    xScale != null;

  return (
    <styled.Container>
      <styled.Header>
        <styled.Summary data-testid={CHART_SUMMARY_TEST_ID}>
          <styled.SummaryTitle>{CHART_LEGEND_TITLE}:</styled.SummaryTitle>
          {CHART_LEGEND_ITEMS.map(({ variant, label }) => (
            <styled.SummaryItem key={variant}>
              <ScheduleDetailMetricsChartStatusIcon
                variant={variant}
                size={CHART_LEGEND_ICON_SIZE_PX}
                animated={false}
              />
              {label}
            </styled.SummaryItem>
          ))}
        </styled.Summary>
        <styled.Toolbar role="toolbar" aria-label={CHART_TOOLBAR_ARIA_LABEL}>
          <Button
            size="mini"
            kind="tertiary"
            disabled={!toolbarEnabled || !canZoomOut}
            aria-disabled={!toolbarEnabled || !canZoomOut}
            overrides={overrides.toolbarButton}
            onClick={zoomOut}
          >
            <styled.ControlContent>
              <MdZoomOut size={CHART_TOOLBAR_ICON_SIZE_PX} />
              {CHART_TOOLBAR_BUTTON_LABELS.zoomOut}
            </styled.ControlContent>
          </Button>
          <Button
            size="mini"
            kind="tertiary"
            disabled={!toolbarEnabled || !canZoomIn}
            aria-disabled={!toolbarEnabled || !canZoomIn}
            overrides={overrides.toolbarButton}
            onClick={zoomIn}
          >
            <styled.ControlContent>
              <MdZoomIn size={CHART_TOOLBAR_ICON_SIZE_PX} />
              {CHART_TOOLBAR_BUTTON_LABELS.zoomIn}
            </styled.ControlContent>
          </Button>
          <Button
            size="mini"
            kind="tertiary"
            disabled={!toolbarEnabled || isFollowing}
            aria-disabled={!toolbarEnabled || isFollowing}
            overrides={overrides.toolbarButton}
            onClick={goToNow}
          >
            <styled.ControlContent>
              <MdGpsFixed size={CHART_TOOLBAR_ICON_SIZE_PX} />
              {CHART_TOOLBAR_BUTTON_LABELS.now}
            </styled.ControlContent>
          </Button>
        </styled.Toolbar>
      </styled.Header>
      <styled.ChartRegion
        ref={chartRegionRef}
        role="region"
        aria-label={CHART_REGION_ARIA_LABEL}
      >
        {isInitialLoading ? <ScheduleDetailMetricsChartLoading /> : null}
        {!isInitialLoading && !canRenderSeries ? (
          <styled.EmptyState role="status">
            {CHART_EMPTY_STATE_MESSAGE}
          </styled.EmptyState>
        ) : null}
        {canRenderSeries ? (
          <styled.ChartCanvas
            ref={canvasRef}
            $isPanning={isPanning}
            $canPan={canPan}
            data-testid={CHART_CANVAS_TEST_ID}
            onPointerDown={handlePanStart}
          >
            <styled.ChartSvg width={chartWidth} height={chartHeight}>
              <ScheduleDetailMetricsChartSeries
                width={chartWidth}
                height={chartHeight}
                xScale={xScale}
                nowMs={nowMs}
                timelineColor={theme.colors.borderOpaque}
                labelColor={theme.colors.contentTertiary}
                labelStrongColor={theme.colors.contentPrimary}
                nowColor={theme.colors.negative300}
              />
            </styled.ChartSvg>
            {isFetchingMore || isFetchMoreError ? (
              <styled.FetchLoadingContainer
                $isError={showFetchMoreError}
                role={showFetchMoreError ? 'alert' : 'status'}
                aria-label={
                  showFetchMoreError
                    ? CHART_FETCH_RETRY_LABEL
                    : CHART_FETCH_LOADING_MESSAGE
                }
                data-testid={CHART_FETCH_LOADING_TEST_ID}
                onPointerDown={(event: React.PointerEvent<HTMLDivElement>) =>
                  event.stopPropagation()
                }
              >
                {showFetchMoreError ? (
                  <Button
                    size="mini"
                    kind="tertiary"
                    aria-label={CHART_FETCH_RETRY_LABEL}
                    overrides={overrides.toolbarButton}
                    onClick={() => void fetchNextWorkflowPage()}
                  >
                    <styled.ControlContent>
                      <MdReportGmailerrorred
                        aria-hidden
                        color={theme.colors.negative}
                        size={CHART_FETCH_RETRY_ICON_SIZE_PX}
                      />
                      Retry
                    </styled.ControlContent>
                  </Button>
                ) : (
                  <Spinner $size={CHART_FETCH_LOADING_SPINNER_SIZE_PX} />
                )}
              </styled.FetchLoadingContainer>
            ) : null}
            <styled.GlyphOverlay>
              {visibleRuns.map(({ scheduledTimeMs, runs }) => (
                <ScheduleDetailMetricsChartGlyph
                  key={`run-trigger-${scheduledTimeMs}`}
                  x={xScale(scheduledTimeMs)}
                  y={CHART_SERIES_TIMELINE_Y_PX}
                  runs={runs}
                  domain={params.domain}
                  cluster={params.cluster}
                  scheduleId={params.scheduleId}
                  variant={
                    runs.length > 1
                      ? 'grouped'
                      : getScheduleMetricsChartStatus(runs[0])
                  }
                  isNew={newRunTimesMs.has(scheduledTimeMs)}
                  testId={CHART_GLYPH_TEST_IDS.runTrigger}
                />
              ))}
              {visibleSkippedExecutions.map(({ scheduledTimeMs, runs }) => (
                <ScheduleDetailMetricsChartGlyph
                  key={`skipped-trigger-${scheduledTimeMs}`}
                  x={xScale(scheduledTimeMs)}
                  y={CHART_SERIES_TIMELINE_Y_PX}
                  runs={runs}
                  scheduledTimeMs={scheduledTimeMs}
                  domain={params.domain}
                  cluster={params.cluster}
                  scheduleId={params.scheduleId}
                  variant="skipped"
                  isNew={newSkippedTimesMs.has(scheduledTimeMs)}
                  testId={CHART_GLYPH_TEST_IDS.skippedExecutionTrigger}
                />
              ))}
              {isNextExecutionVisible &&
              chartData.nextExecutionTimeMs != null ? (
                <ScheduleDetailMetricsChartGlyph
                  x={xScale(chartData.nextExecutionTimeMs)}
                  y={CHART_SERIES_TIMELINE_Y_PX}
                  runs={[]}
                  scheduledTimeMs={chartData.nextExecutionTimeMs}
                  domain={params.domain}
                  cluster={params.cluster}
                  scheduleId={params.scheduleId}
                  variant="next"
                  isNew={newNextTimesMs.has(chartData.nextExecutionTimeMs)}
                  testId={CHART_SERIES_TEST_IDS.nextExecutionMarker}
                />
              ) : null}
            </styled.GlyphOverlay>
          </styled.ChartCanvas>
        ) : null}
      </styled.ChartRegion>
    </styled.Container>
  );
}
