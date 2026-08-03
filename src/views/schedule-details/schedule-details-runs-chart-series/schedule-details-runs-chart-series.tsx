import React, { useMemo } from 'react';

import groupBy from 'lodash/groupBy';

import ScheduleDetailsRunsChartGlyph from '../schedule-details-runs-chart-glyph/schedule-details-runs-chart-glyph';
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
}: Props) {
  const markers = useMemo(() => {
    const runGroups = Object.values(groupBy(data.runs, 'scheduledTimeMs')).map(
      (runs) => ({
        scheduledTimeMs: runs[0].scheduledTimeMs,
        runs,
      })
    );

    const items: ChartSeriesMarker[] = [
      ...runGroups.map((group) => ({ kind: 'run' as const, ...group })),
      ...data.skippedExecutions.map(({ scheduledTimeMs }) => ({
        kind: 'skipped' as const,
        scheduledTimeMs,
      })),
      ...data.pendingExecutions.map(({ scheduledTimeMs }) => ({
        kind: 'pending' as const,
        scheduledTimeMs,
      })),
      ...(data.nextExecutionTimeMs != null
        ? [
            {
              kind: 'next' as const,
              scheduledTimeMs: data.nextExecutionTimeMs,
            },
          ]
        : []),
    ];

    // Later markers in DOM stack above earlier ones — sort left-to-right on the timeline.
    return items.sort((a, b) => a.scheduledTimeMs - b.scheduledTimeMs);
  }, [data]);

  return (
    <div data-testid={CHART_SERIES_TEST_IDS.overlay}>
      {markers.map((marker, index) => {
        switch (marker.kind) {
          case 'run': {
            const isGrouped = marker.runs.length > 1;

            return (
              <ScheduleDetailsRunsChartGlyph
                key={`run-${index}-${marker.scheduledTimeMs}`}
                x={xScale(marker.scheduledTimeMs)}
                y={CHART_TIMELINE_Y_PX}
                variant={marker.runs[0].status}
                runCount={marker.runs.length}
                isBackfill={marker.runs[0].isBackfill}
                label={formatChartSeriesRunGroupLabel(marker.runs)}
                testId={
                  isGrouped
                    ? CHART_SERIES_TEST_IDS.groupedMarker
                    : CHART_SERIES_TEST_IDS.runMarker
                }
              />
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
          case 'pending':
            return (
              <ScheduleDetailsRunsChartGlyph
                key={`pending-${index}-${marker.scheduledTimeMs}`}
                x={xScale(marker.scheduledTimeMs)}
                y={CHART_TIMELINE_Y_PX}
                variant="pending"
                label={formatChartSeriesMomentLabel(
                  'pending',
                  marker.scheduledTimeMs
                )}
                testId={CHART_SERIES_TEST_IDS.pendingExecutionMarker}
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
