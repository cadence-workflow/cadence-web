import React from 'react';

import { scaleLinear } from '@visx/scale';

import { render, screen } from '@/test-utils/rtl';

import ScheduleDetailsRunsChartSeries from '../schedule-details-runs-chart-series';
import { CHART_SERIES_TEST_IDS } from '../schedule-details-runs-chart-series.constants';
import { type ChartSeriesData } from '../schedule-details-runs-chart-series.types';

const WINDOW_START_MS = Date.UTC(2024, 0, 1, 0, 0);
const WINDOW_END_MS = Date.UTC(2024, 0, 1, 6, 0);

describe(ScheduleDetailsRunsChartSeries.name, () => {
  it('renders a marker for each successful run', () => {
    setup({
      data: {
        successfulRuns: [
          { scheduledTimeMs: Date.UTC(2024, 0, 1, 1, 0) },
          { scheduledTimeMs: Date.UTC(2024, 0, 1, 2, 0) },
        ],
        missedExecutions: [],
        nextExecutionTimeMs: null,
      },
    });

    expect(
      screen.getAllByTestId(CHART_SERIES_TEST_IDS.successfulRunMarker)
    ).toHaveLength(2);
  });

  it('renders a marker for each missed execution', () => {
    setup({
      data: {
        successfulRuns: [],
        missedExecutions: [{ scheduledTimeMs: Date.UTC(2024, 0, 1, 3, 0) }],
        nextExecutionTimeMs: null,
      },
    });

    expect(
      screen.getByTestId(CHART_SERIES_TEST_IDS.missedExecutionMarker)
    ).toBeInTheDocument();
  });

  it('renders the next execution marker when set', () => {
    setup({
      data: {
        successfulRuns: [],
        missedExecutions: [],
        nextExecutionTimeMs: Date.UTC(2024, 0, 1, 5, 0),
      },
    });

    expect(
      screen.getByTestId(CHART_SERIES_TEST_IDS.nextExecutionMarker)
    ).toBeInTheDocument();
  });

  it('omits the next execution marker when unset', () => {
    setup({
      data: {
        successfulRuns: [],
        missedExecutions: [],
        nextExecutionTimeMs: null,
      },
    });

    expect(
      screen.queryByTestId(CHART_SERIES_TEST_IDS.nextExecutionMarker)
    ).not.toBeInTheDocument();
  });
});

function setup({ data }: { data: ChartSeriesData }) {
  render(
    <svg>
      <ScheduleDetailsRunsChartSeries
        height={82}
        xScale={scaleLinear({
          domain: [WINDOW_START_MS, WINDOW_END_MS],
          range: [0, 800],
        })}
        data={data}
        successfulRunColor="green"
        missedExecutionColor="orange"
        nextExecutionColor="blue"
      />
    </svg>
  );
}
