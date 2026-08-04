import React, { useMemo } from 'react';

import groupBy from 'lodash/groupBy';

import { CHART_RUN_POPOVER_TEST_IDS } from '../schedule-details-runs-chart/schedule-details-runs-chart.constants';
import ScheduleDetailsRunsChartGlyph from '../schedule-details-runs-chart-glyph/schedule-details-runs-chart-glyph';
import ScheduleDetailsRunsChartPopoverTrigger from '../schedule-details-runs-chart-popover-trigger/schedule-details-runs-chart-popover-trigger';
import { CHART_TIMELINE_Y_PX } from '../schedule-details-runs-chart-timeline/schedule-details-runs-chart-timeline.constants';

import {
  formatChartSeriesMomentLabel,
  formatChartSeriesRunGroupLabel,
} from './helpers/format-chart-series-marker-label';
import { CHART_SERIES_TEST_IDS } from './schedule-details-runs-chart-series.constants';
import {
  type ChartSeriesMarker,
  type ChartSeriesNewTimesMs,
  type Props,
} from './schedule-details-runs-chart-series.types';

const NO_NEW_TIMES_MS: ChartSeriesNewTimesMs = {
  runs: new Set(),
  skipped: new Set(),
  next: new Set(),
};

export default function ScheduleDetailsRunsChartSeries({
  xScale,
  data,
  domain,
  cluster,
  scheduleId,
  newTimesMs = NO_NEW_TIMES_MS,
}: Props) {
  const markers = useMemo(() => {
    const groupedExecutions = Object.values(
      groupBy(data.runs, 'scheduledTimeMs')
    ).map((runs) => ({
      scheduledTimeMs: runs[0].scheduledTimeMs,
      runs,
    }));
    const nextExecution =
      data.nextExecutionTimeMs != null
        ? [{ scheduledTimeMs: data.nextExecutionTimeMs }]
        : [];

    const items: ChartSeriesMarker[] = (
      [
        ['run', groupedExecutions],
        ['skipped', data.skippedExecutions],
        ['loading', data.unconfirmedExecutions],
        ['next', nextExecution],
      ] as const
    ).flatMap(([kind, points]) =>
      points.map((point) => ({ kind, ...point }) as ChartSeriesMarker)
    );

    // Later markers in DOM stack above earlier ones — sort left-to-right on the timeline.
    return items.sort((a, b) => a.scheduledTimeMs - b.scheduledTimeMs);
  }, [data]);

  return (
    <div data-testid={CHART_SERIES_TEST_IDS.overlay}>
      {markers.map((marker, index) => {
        switch (marker.kind) {
          case 'run': {
            const isGrouped = marker.runs.length > 1;
            const x = xScale(marker.scheduledTimeMs);
            const label = formatChartSeriesRunGroupLabel(marker.runs);
            const markerTestId = isGrouped
              ? CHART_SERIES_TEST_IDS.groupedMarker
              : CHART_SERIES_TEST_IDS.runMarker;

            return (
              <React.Fragment key={`run-${index}-${marker.scheduledTimeMs}`}>
                <ScheduleDetailsRunsChartGlyph
                  x={x}
                  y={CHART_TIMELINE_Y_PX}
                  variant={marker.runs[0].status}
                  runCount={marker.runs.length}
                  isBackfill={marker.runs[0].isBackfill}
                  isNew={newTimesMs.runs.has(marker.scheduledTimeMs)}
                  label={label}
                  testId={markerTestId}
                />
                <ScheduleDetailsRunsChartPopoverTrigger
                  x={x}
                  y={CHART_TIMELINE_Y_PX}
                  entries={marker.runs.map((run) => ({
                    kind: 'run',
                    run,
                  }))}
                  domain={domain}
                  cluster={cluster}
                  scheduleId={scheduleId}
                  ariaLabel={label}
                  testId={CHART_RUN_POPOVER_TEST_IDS.runTrigger}
                />
              </React.Fragment>
            );
          }
          case 'skipped': {
            const x = xScale(marker.scheduledTimeMs);
            const label = formatChartSeriesMomentLabel(
              'skipped',
              marker.scheduledTimeMs
            );

            return (
              <React.Fragment
                key={`skipped-${index}-${marker.scheduledTimeMs}`}
              >
                <ScheduleDetailsRunsChartGlyph
                  x={x}
                  y={CHART_TIMELINE_Y_PX}
                  variant="skipped"
                  isNew={newTimesMs.skipped.has(marker.scheduledTimeMs)}
                  label={label}
                  testId={CHART_SERIES_TEST_IDS.skippedExecutionMarker}
                />
                <ScheduleDetailsRunsChartPopoverTrigger
                  x={x}
                  y={CHART_TIMELINE_Y_PX}
                  entries={[
                    {
                      kind: 'skipped',
                      scheduledTimeMs: marker.scheduledTimeMs,
                    },
                  ]}
                  domain={domain}
                  cluster={cluster}
                  scheduleId={scheduleId}
                  ariaLabel={label}
                  testId={CHART_RUN_POPOVER_TEST_IDS.skippedTrigger}
                />
              </React.Fragment>
            );
          }
          case 'loading':
            return (
              <ScheduleDetailsRunsChartGlyph
                key={`loading-${index}-${marker.scheduledTimeMs}`}
                x={xScale(marker.scheduledTimeMs)}
                y={CHART_TIMELINE_Y_PX}
                variant="loading"
                label={formatChartSeriesMomentLabel(
                  'loading',
                  marker.scheduledTimeMs
                )}
                testId={CHART_SERIES_TEST_IDS.loadingExecutionMarker}
              />
            );
          case 'next': {
            const x = xScale(marker.scheduledTimeMs);
            const label = formatChartSeriesMomentLabel(
              'next',
              marker.scheduledTimeMs
            );

            return (
              <React.Fragment key={`next-${index}-${marker.scheduledTimeMs}`}>
                <ScheduleDetailsRunsChartGlyph
                  x={x}
                  y={CHART_TIMELINE_Y_PX}
                  variant="next"
                  isNew={newTimesMs.next.has(marker.scheduledTimeMs)}
                  label={label}
                  testId={CHART_SERIES_TEST_IDS.nextExecutionMarker}
                />
                <ScheduleDetailsRunsChartPopoverTrigger
                  x={x}
                  y={CHART_TIMELINE_Y_PX}
                  entries={[
                    {
                      kind: 'next',
                      scheduledTimeMs: marker.scheduledTimeMs,
                    },
                  ]}
                  domain={domain}
                  cluster={cluster}
                  scheduleId={scheduleId}
                  ariaLabel={label}
                  testId={CHART_RUN_POPOVER_TEST_IDS.nextTrigger}
                />
              </React.Fragment>
            );
          }
        }
      })}
    </div>
  );
}
