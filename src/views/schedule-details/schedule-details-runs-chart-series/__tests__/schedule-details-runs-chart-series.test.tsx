import React from 'react';

import { scaleLinear } from '@visx/scale';

import { render, screen } from '@/test-utils/rtl';

import { type Props as GlyphProps } from '../../schedule-details-runs-chart-glyph/schedule-details-runs-chart-glyph.types';
import ScheduleDetailsRunsChartSeries from '../schedule-details-runs-chart-series';
import { CHART_SERIES_TEST_IDS } from '../schedule-details-runs-chart-series.constants';
import { type ChartSeriesData } from '../schedule-details-runs-chart-series.types';

jest.mock(
  '../../schedule-details-runs-chart-glyph/schedule-details-runs-chart-glyph',
  () =>
    function MockScheduleDetailsRunsChartGlyph({
      variant,
      runCount,
      testId,
    }: GlyphProps) {
      return (
        <div data-testid={testId} data-variant={variant}>
          {runCount}
        </div>
      );
    }
);

const WINDOW_START_MS = Date.UTC(2024, 0, 1, 0, 0);
const WINDOW_END_MS = Date.UTC(2024, 0, 1, 6, 0);
const EMPTY_DATA: ChartSeriesData = {
  runs: [],
  skippedExecutions: [],
  nextExecutionTimeMs: null,
};

describe(ScheduleDetailsRunsChartSeries.name, () => {
  it('renders a marker for each run', () => {
    setup({
      data: {
        runs: [
          {
            runId: 'run-1',
            scheduledTimeMs: Date.UTC(2024, 0, 1, 1, 0),
            status: 'completed',
          },
          {
            runId: 'run-2',
            scheduledTimeMs: Date.UTC(2024, 0, 1, 2, 0),
            status: 'failed',
          },
        ],
        skippedExecutions: [],
        nextExecutionTimeMs: null,
      },
    });

    expect(screen.getAllByTestId(CHART_SERIES_TEST_IDS.runMarker)).toHaveLength(
      2
    );
  });

  it('renders a single grouped marker with a run count for runs sharing a scheduled time', () => {
    setup({
      data: {
        runs: [
          {
            runId: 'run-1',
            scheduledTimeMs: Date.UTC(2024, 0, 1, 1, 0),
            status: 'completed',
          },
          {
            runId: 'run-2',
            scheduledTimeMs: Date.UTC(2024, 0, 1, 1, 0),
            status: 'failed',
          },
        ],
        skippedExecutions: [],
        nextExecutionTimeMs: null,
      },
    });

    expect(
      screen.queryByTestId(CHART_SERIES_TEST_IDS.runMarker)
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId(CHART_SERIES_TEST_IDS.groupedMarker)
    ).toHaveTextContent('2');
  });

  it('renders a marker for each skipped execution', () => {
    setup({
      data: {
        ...EMPTY_DATA,
        skippedExecutions: [{ scheduledTimeMs: Date.UTC(2024, 0, 1, 3, 0) }],
      },
    });

    expect(
      screen.getByTestId(CHART_SERIES_TEST_IDS.skippedExecutionMarker)
    ).toBeInTheDocument();
  });

  it('renders the next execution marker when set', () => {
    setup({
      data: {
        ...EMPTY_DATA,
        nextExecutionTimeMs: Date.UTC(2024, 0, 1, 5, 0),
      },
    });

    expect(
      screen.getByTestId(CHART_SERIES_TEST_IDS.nextExecutionMarker)
    ).toBeInTheDocument();
  });

  it('omits the next execution marker when unset', () => {
    setup({ data: EMPTY_DATA });

    expect(
      screen.queryByTestId(CHART_SERIES_TEST_IDS.nextExecutionMarker)
    ).not.toBeInTheDocument();
  });
});

function setup({ data }: { data: ChartSeriesData }) {
  render(
    <ScheduleDetailsRunsChartSeries
      xScale={scaleLinear({
        domain: [WINDOW_START_MS, WINDOW_END_MS],
        range: [0, 800],
      })}
      data={data}
    />
  );
}
