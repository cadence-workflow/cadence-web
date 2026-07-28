import React from 'react';

import { Group } from '@visx/group';
import { Line } from '@visx/shape';
import { useStyletron } from 'baseui';

import formatChartTimeTick from './helpers/format-chart-time-tick';
import resolveChartTickCount from './helpers/resolve-chart-tick-count';
import {
  CHART_NOW_MARKER_TEST_ID,
  CHART_NOW_STROKE_WIDTH_PX,
  CHART_TICK_FONT_SIZE_PX,
  CHART_TICK_LABEL_Y_PX,
  CHART_TIMELINE_TEST_ID,
  CHART_TIMELINE_Y_PX,
} from './schedule-details-runs-chart-timeline.constants';
import { type Props } from './schedule-details-runs-chart-timeline.types';

export default function ScheduleDetailsRunsChartTimeline({
  width,
  height,
  xScale,
  nowMs,
}: Props) {
  const [, theme] = useStyletron();
  const [visibleMinMs, visibleMaxMs] = xScale.domain();
  const tickCount = resolveChartTickCount(width);
  const tickStepMs = (visibleMaxMs - visibleMinMs) / (tickCount - 1);
  const ticksMs = Array.from(
    { length: tickCount },
    (_, index) => visibleMinMs + tickStepMs * index
  );
  const isNowVisible = nowMs >= visibleMinMs && nowMs <= visibleMaxMs;

  return (
    <Group data-testid={CHART_TIMELINE_TEST_ID}>
      {ticksMs.map((timestampMs, index) => {
        const { date, time } = formatChartTimeTick(timestampMs);

        // The edge labels are anchored inwards so they stay inside the chart.
        let textAnchor: 'start' | 'middle' | 'end' = 'middle';
        if (index === 0) {
          textAnchor = 'start';
        } else if (index === ticksMs.length - 1) {
          textAnchor = 'end';
        }

        return (
          <text
            key={timestampMs}
            x={xScale(timestampMs)}
            y={CHART_TICK_LABEL_Y_PX}
            textAnchor={textAnchor}
            fontSize={CHART_TICK_FONT_SIZE_PX}
            pointerEvents="none"
          >
            <tspan fill={theme.colors.contentTertiary}>{date} </tspan>
            <tspan fill={theme.colors.contentPrimary} fontWeight={500}>
              {time}
            </tspan>
          </text>
        );
      })}
      <Line
        from={{ x: 0, y: CHART_TIMELINE_Y_PX }}
        to={{ x: width, y: CHART_TIMELINE_Y_PX }}
        stroke={theme.colors.borderOpaque}
        pointerEvents="none"
      />
      {isNowVisible && (
        <Line
          data-testid={CHART_NOW_MARKER_TEST_ID}
          from={{ x: xScale(nowMs), y: 0 }}
          to={{ x: xScale(nowMs), y: height }}
          stroke={theme.colors.negative300}
          strokeWidth={CHART_NOW_STROKE_WIDTH_PX}
          pointerEvents="none"
        />
      )}
    </Group>
  );
}
