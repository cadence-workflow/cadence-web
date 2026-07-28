import React from 'react';

import { scaleLinear } from '@visx/scale';

import { render, screen } from '@/test-utils/rtl';

import { CHART_HEIGHT_PX } from '../../schedule-details-runs-chart/schedule-details-runs-chart.constants';
import ScheduleDetailsRunsChartTimeline from '../schedule-details-runs-chart-timeline';
import {
  CHART_MAX_TICK_COUNT,
  CHART_MIN_TICK_COUNT,
  CHART_NOW_MARKER_TEST_ID,
  CHART_TIMELINE_TEST_ID,
} from '../schedule-details-runs-chart-timeline.constants';

const WINDOW_START_MS = Date.UTC(2024, 0, 1, 0, 0);
const WINDOW_END_MS = Date.UTC(2024, 0, 1, 6, 0);
const NOW_MS = Date.UTC(2024, 0, 1, 3, 0);

describe(ScheduleDetailsRunsChartTimeline.name, () => {
  it('labels the window ends and spreads as many ticks between them as fit', () => {
    setup();

    const labels = getTickLabels();

    expect(labels).toHaveLength(CHART_MAX_TICK_COUNT);
    expect(labels[0]).toHaveTextContent('Jan 1, 00:00');
    expect(labels[labels.length - 1]).toHaveTextContent('Jan 1, 06:00');
  });

  it('anchors the end labels inwards so they stay inside the chart', () => {
    setup();

    const labels = getTickLabels();

    expect(labels[0]).toHaveAttribute('text-anchor', 'start');
    expect(labels[1]).toHaveAttribute('text-anchor', 'middle');
    expect(labels[labels.length - 1]).toHaveAttribute('text-anchor', 'end');
  });

  it('thins the labels out on a chart too narrow to fit them', () => {
    setup({ width: 120 });

    expect(getTickLabels()).toHaveLength(CHART_MIN_TICK_COUNT);
  });

  it('marks now while it falls inside the window', () => {
    setup();

    expect(screen.getByTestId(CHART_NOW_MARKER_TEST_ID)).toBeInTheDocument();
  });

  it('drops the now marker once the window no longer contains it', () => {
    setup({ nowMs: WINDOW_END_MS + 60_000 });

    expect(
      screen.queryByTestId(CHART_NOW_MARKER_TEST_ID)
    ).not.toBeInTheDocument();
  });
});

function setup({
  width = 800,
  nowMs = NOW_MS,
}: { width?: number; nowMs?: number } = {}) {
  render(
    <svg>
      <ScheduleDetailsRunsChartTimeline
        width={width}
        height={CHART_HEIGHT_PX}
        xScale={scaleLinear({
          domain: [WINDOW_START_MS, WINDOW_END_MS],
          range: [0, width],
        })}
        nowMs={nowMs}
      />
    </svg>
  );
}

function getTickLabels() {
  return screen.getByTestId(CHART_TIMELINE_TEST_ID).querySelectorAll('text');
}
