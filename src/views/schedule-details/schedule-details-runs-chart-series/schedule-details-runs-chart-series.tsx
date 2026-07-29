import React, { useMemo } from 'react';

import groupBy from 'lodash/groupBy';

import ScheduleDetailsRunsChartGlyph from '../schedule-details-runs-chart-glyph/schedule-details-runs-chart-glyph';
import { CHART_TIMELINE_Y_PX } from '../schedule-details-runs-chart-timeline/schedule-details-runs-chart-timeline.constants';

import {
  formatChartSeriesMomentLabel,
  formatChartSeriesRunGroupLabel,
} from './helpers/format-chart-series-marker-label';
import { CHART_SERIES_TEST_IDS } from './schedule-details-runs-chart-series.constants';
import { type Props } from './schedule-details-runs-chart-series.types';

export default function ScheduleDetailsRunsChartSeries({
  xScale,
  data,
}: Props) {
  const runGroups = useMemo(
    () =>
      Object.values(groupBy(data.runs, 'scheduledTimeMs')).map((runs) => ({
        scheduledTimeMs: runs[0].scheduledTimeMs,
        runs,
      })),
    [data.runs]
  );

  return (
    <div data-testid={CHART_SERIES_TEST_IDS.overlay}>
      {runGroups.map((group, index) => {
        const isGrouped = group.runs.length > 1;

        return (
          <ScheduleDetailsRunsChartGlyph
            key={`run-${index}-${group.scheduledTimeMs}`}
            x={xScale(group.scheduledTimeMs)}
            y={CHART_TIMELINE_Y_PX}
            variant={group.runs[0].status}
            runCount={group.runs.length}
            isBackfill={group.runs[0].isBackfill}
            label={formatChartSeriesRunGroupLabel(group.runs)}
            testId={
              isGrouped
                ? CHART_SERIES_TEST_IDS.groupedMarker
                : CHART_SERIES_TEST_IDS.runMarker
            }
          />
        );
      })}
      {data.skippedExecutions.map(({ scheduledTimeMs }, index) => (
        <ScheduleDetailsRunsChartGlyph
          key={`skipped-${index}-${scheduledTimeMs}`}
          x={xScale(scheduledTimeMs)}
          y={CHART_TIMELINE_Y_PX}
          variant="skipped"
          label={formatChartSeriesMomentLabel('skipped', scheduledTimeMs)}
          testId={CHART_SERIES_TEST_IDS.skippedExecutionMarker}
        />
      ))}
      {data.nextExecutionTimeMs != null && (
        <ScheduleDetailsRunsChartGlyph
          x={xScale(data.nextExecutionTimeMs)}
          y={CHART_TIMELINE_Y_PX}
          variant="next"
          label={formatChartSeriesMomentLabel('next', data.nextExecutionTimeMs)}
          testId={CHART_SERIES_TEST_IDS.nextExecutionMarker}
        />
      )}
    </div>
  );
}
