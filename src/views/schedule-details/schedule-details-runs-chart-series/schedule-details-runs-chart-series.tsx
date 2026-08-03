import React, { useMemo } from 'react';

import groupBy from 'lodash/groupBy';

import { CHART_RUN_POPOVER_TEST_IDS } from '../schedule-details-runs-chart/schedule-details-runs-chart.constants';
import ScheduleDetailsRunsChartGlyph from '../schedule-details-runs-chart-glyph/schedule-details-runs-chart-glyph';
import ScheduleDetailsRunsChartRunPopoverTrigger from '../schedule-details-runs-chart-run-popover-trigger/schedule-details-runs-chart-run-popover-trigger';
import { CHART_TIMELINE_Y_PX } from '../schedule-details-runs-chart-timeline/schedule-details-runs-chart-timeline.constants';

import {
  formatChartSeriesMomentLabel,
  formatChartSeriesRunGroupLabel,
} from './helpers/format-chart-series-marker-label';
import { CHART_SERIES_TEST_IDS } from './schedule-details-runs-chart-series.constants';
import {
  type ChartSeriesMarker,
  type Props,
} from './schedule-details-runs-chart-series.types';

export default function ScheduleDetailsRunsChartSeries({
  xScale,
  data,
  domain,
  cluster,
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
                  label={label}
                  testId={markerTestId}
                />
                <ScheduleDetailsRunsChartRunPopoverTrigger
                  x={x}
                  y={CHART_TIMELINE_Y_PX}
                  runs={marker.runs}
                  domain={domain}
                  cluster={cluster}
                  ariaLabel={label}
                  testId={CHART_RUN_POPOVER_TEST_IDS.runTrigger}
                />
              </React.Fragment>
            );
          }
          case 'skipped':
            return (
              <ScheduleDetailsRunsChartGlyph
                key={`skipped-${index}-${marker.scheduledTimeMs}`}
                x={xScale(marker.scheduledTimeMs)}
                y={CHART_TIMELINE_Y_PX}
                variant="skipped"
                label={formatChartSeriesMomentLabel(
                  'skipped',
                  marker.scheduledTimeMs
                )}
                testId={CHART_SERIES_TEST_IDS.skippedExecutionMarker}
              />
            );
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
          case 'next':
            return (
              <ScheduleDetailsRunsChartGlyph
                key={`next-${index}-${marker.scheduledTimeMs}`}
                x={xScale(marker.scheduledTimeMs)}
                y={CHART_TIMELINE_Y_PX}
                variant="next"
                label={formatChartSeriesMomentLabel(
                  'next',
                  marker.scheduledTimeMs
                )}
                testId={CHART_SERIES_TEST_IDS.nextExecutionMarker}
              />
            );
        }
      })}
    </div>
  );
}
