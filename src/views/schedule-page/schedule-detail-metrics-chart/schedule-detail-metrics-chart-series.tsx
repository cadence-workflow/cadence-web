import React from 'react';

import { Group } from '@visx/group';
import { Circle, Line } from '@visx/shape';

import {
  CHART_SERIES_MARKER_RADIUS_PX,
  CHART_SERIES_MISSED_MARKER_RADIUS_PX,
  CHART_SERIES_MISSED_STROKE_WIDTH_PX,
  CHART_SERIES_MISSED_Y_RATIO,
  CHART_SERIES_NEXT_EXECUTION_STROKE_WIDTH_PX,
  CHART_SERIES_SUCCESS_Y_RATIO,
  CHART_SERIES_TEST_IDS,
} from './schedule-detail-metrics-chart.constants';
import { type ScheduleMetricsChartSeriesProps } from './schedule-detail-metrics-chart-series.types';

export default function ScheduleDetailMetricsChartSeries({
  width,
  height,
  xScale,
  data,
  successfulRunColor,
  missedExecutionColor,
  nextExecutionColor,
}: ScheduleMetricsChartSeriesProps) {
  const successfulRunY = height * CHART_SERIES_SUCCESS_Y_RATIO;
  const missedExecutionY = height * CHART_SERIES_MISSED_Y_RATIO;

  return (
    <Group data-testid={CHART_SERIES_TEST_IDS.svg}>
      {data.successfulRuns.map(({ scheduledTimeMs }) => (
        <Circle
          key={`successful-${scheduledTimeMs}`}
          cx={xScale(scheduledTimeMs)}
          cy={successfulRunY}
          r={CHART_SERIES_MARKER_RADIUS_PX}
          fill={successfulRunColor}
          pointerEvents="none"
          data-testid={CHART_SERIES_TEST_IDS.successfulRunMarker}
        />
      ))}
      {data.missedExecutions.map(({ scheduledTimeMs }) => {
        const x = xScale(scheduledTimeMs);

        return (
          <Group key={`missed-${scheduledTimeMs}`}>
            <Line
              from={{ x, y: successfulRunY }}
              to={{ x, y: missedExecutionY }}
              stroke={missedExecutionColor}
              strokeWidth={CHART_SERIES_MISSED_STROKE_WIDTH_PX}
              strokeDasharray="4 3"
              pointerEvents="none"
            />
            <Circle
              cx={x}
              cy={missedExecutionY}
              r={CHART_SERIES_MISSED_MARKER_RADIUS_PX}
              fill="transparent"
              stroke={missedExecutionColor}
              strokeWidth={CHART_SERIES_MISSED_STROKE_WIDTH_PX}
              pointerEvents="none"
              data-testid={CHART_SERIES_TEST_IDS.missedExecutionMarker}
            />
          </Group>
        );
      })}
      {data.nextExecutionTimeMs != null && (
        <Line
          from={{ x: xScale(data.nextExecutionTimeMs), y: 0 }}
          to={{ x: xScale(data.nextExecutionTimeMs), y: height }}
          stroke={nextExecutionColor}
          strokeWidth={CHART_SERIES_NEXT_EXECUTION_STROKE_WIDTH_PX}
          strokeDasharray="6 4"
          pointerEvents="none"
          data-testid={CHART_SERIES_TEST_IDS.nextExecutionMarker}
        />
      )}
      <rect width={width} height={height} fill="transparent" pointerEvents="none" />
    </Group>
  );
}
