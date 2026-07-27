import React from 'react';

import { Group } from '@visx/group';
import { Line } from '@visx/shape';

import formatChartTimeTick from './helpers/format-chart-time-tick';
import resolveMetricsChartTickCount from './helpers/resolve-metrics-chart-tick-count';
import { type ScheduleMetricsChartSeriesProps } from './schedule-detail-metrics-chart-series.types';
import {
  CHART_SERIES_LABEL_Y_PX,
  CHART_SERIES_NOW_STROKE_WIDTH_PX,
  CHART_SERIES_TICK_FONT_SIZE_PX,
  CHART_SERIES_TIMELINE_Y_PX,
  CHART_SERIES_TEST_IDS,
} from './schedule-detail-metrics-chart.constants';

export default function ScheduleDetailMetricsChartSeries({
  width,
  height,
  xScale,
  nowMs,
  timelineColor,
  labelColor,
  labelStrongColor,
  nowColor,
}: ScheduleMetricsChartSeriesProps) {
  const [visibleMinMs, visibleMaxMs] = xScale.domain();
  const tickCount = resolveMetricsChartTickCount(width);
  const tickStepMs = (visibleMaxMs - visibleMinMs) / (tickCount - 1);
  const ticks = Array.from(
    { length: tickCount },
    (_, index) => visibleMinMs + tickStepMs * index
  );
  const isNowVisible = nowMs >= visibleMinMs && nowMs <= visibleMaxMs;

  return (
    <Group data-testid={CHART_SERIES_TEST_IDS.svg}>
      {ticks.map((timestampMs, index) => {
        const { date, time } = formatChartTimeTick(timestampMs);
        const x = xScale(timestampMs);
        let textAnchor: 'start' | 'middle' | 'end' = 'middle';

        if (index === 0) {
          textAnchor = 'start';
        } else if (index === ticks.length - 1) {
          textAnchor = 'end';
        }

        return (
          <text
            key={timestampMs}
            x={x}
            y={CHART_SERIES_LABEL_Y_PX}
            textAnchor={textAnchor}
            fontSize={CHART_SERIES_TICK_FONT_SIZE_PX}
            pointerEvents="none"
          >
            <tspan fill={labelColor}>{date} </tspan>
            <tspan fill={labelStrongColor} fontWeight={500}>
              {time}
            </tspan>
          </text>
        );
      })}
      <Line
        from={{ x: 0, y: CHART_SERIES_TIMELINE_Y_PX }}
        to={{ x: width, y: CHART_SERIES_TIMELINE_Y_PX }}
        stroke={timelineColor}
        pointerEvents="none"
      />
      {isNowVisible && (
        <Line
          from={{ x: xScale(nowMs), y: 0 }}
          to={{ x: xScale(nowMs), y: height }}
          stroke={nowColor}
          strokeWidth={CHART_SERIES_NOW_STROKE_WIDTH_PX}
          strokeDasharray="2 2"
          pointerEvents="none"
          data-testid={CHART_SERIES_TEST_IDS.nowMarker}
        />
      )}
      <rect
        width={width}
        height={height}
        fill="transparent"
        pointerEvents="none"
      />
    </Group>
  );
}
