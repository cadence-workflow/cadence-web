import React from 'react';

import { scaleLinear } from '@visx/scale';

import { render, screen } from '@/test-utils/rtl';

import { WORKFLOW_STATUSES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import { CHART_RUN_POPOVER_TEST_IDS } from '../../schedule-details-runs-chart/schedule-details-runs-chart.constants';
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

jest.mock(
  '../../schedule-details-runs-chart-run-popover-trigger/schedule-details-runs-chart-run-popover-trigger',
  () =>
    function MockScheduleDetailsRunsChartRunPopoverTrigger({
      testId,
    }: {
      testId: string;
    }) {
      return <div data-testid={testId} />;
    }
);

const mockDomain = 'test-domain';
const mockCluster = 'test-cluster';

const mockRun = (
  overrides: Partial<ChartSeriesData['runs'][number]> &
    Pick<
      ChartSeriesData['runs'][number],
      'runId' | 'scheduledTimeMs' | 'status'
    >
) => ({
  workflowId: 'wf-1',
  startedTimeMs: null,
  endedTimeMs: null,
  ...overrides,
});

const WINDOW_START_MS = Date.UTC(2024, 0, 1, 0, 0);
const WINDOW_END_MS = Date.UTC(2024, 0, 1, 6, 0);
const EMPTY_DATA: ChartSeriesData = {
  runs: [],
  skippedExecutions: [],
  unconfirmedExecutions: [],
  nextExecutionTimeMs: null,
};

describe(ScheduleDetailsRunsChartSeries.name, () => {
  it('renders a marker for each run', () => {
    setup({
      data: {
        runs: [
          mockRun({
            runId: 'run-1',
            scheduledTimeMs: Date.UTC(2024, 0, 1, 1, 0),
            status: WORKFLOW_STATUSES.completed,
          }),
          mockRun({
            runId: 'run-2',
            scheduledTimeMs: Date.UTC(2024, 0, 1, 2, 0),
            status: WORKFLOW_STATUSES.failed,
          }),
        ],
        skippedExecutions: [],
        unconfirmedExecutions: [],
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
          mockRun({
            runId: 'run-1',
            scheduledTimeMs: Date.UTC(2024, 0, 1, 1, 0),
            status: WORKFLOW_STATUSES.completed,
          }),
          mockRun({
            runId: 'run-2',
            scheduledTimeMs: Date.UTC(2024, 0, 1, 1, 0),
            status: WORKFLOW_STATUSES.failed,
          }),
        ],
        skippedExecutions: [],
        unconfirmedExecutions: [],
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

  it('renders a marker for each unconfirmed execution', () => {
    setup({
      data: {
        ...EMPTY_DATA,
        unconfirmedExecutions: [
          { scheduledTimeMs: Date.UTC(2024, 0, 1, 3, 0) },
        ],
      },
    });

    expect(
      screen.getByTestId(CHART_SERIES_TEST_IDS.loadingExecutionMarker)
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

  it('renders a popover trigger for the next execution when set', () => {
    setup({
      data: {
        ...EMPTY_DATA,
        nextExecutionTimeMs: Date.UTC(2024, 0, 1, 5, 0),
      },
    });

    expect(
      screen.getByTestId(CHART_RUN_POPOVER_TEST_IDS.nextTrigger)
    ).toBeInTheDocument();
  });

  it('renders a popover trigger for each skipped execution', () => {
    setup({
      data: {
        ...EMPTY_DATA,
        skippedExecutions: [{ scheduledTimeMs: Date.UTC(2024, 0, 1, 3, 0) }],
      },
    });

    expect(
      screen.getByTestId(CHART_RUN_POPOVER_TEST_IDS.skippedTrigger)
    ).toBeInTheDocument();
  });

  it('renders markers in timeline order so right-side icons stack above left-side icons', () => {
    setup({
      data: {
        runs: [
          mockRun({
            runId: 'run-1',
            scheduledTimeMs: Date.UTC(2024, 0, 1, 4, 0),
            status: WORKFLOW_STATUSES.completed,
          }),
        ],
        skippedExecutions: [{ scheduledTimeMs: Date.UTC(2024, 0, 1, 2, 0) }],
        unconfirmedExecutions: [
          { scheduledTimeMs: Date.UTC(2024, 0, 1, 1, 0) },
        ],
        nextExecutionTimeMs: Date.UTC(2024, 0, 1, 5, 0),
      },
    });

    const overlay = screen.getByTestId(CHART_SERIES_TEST_IDS.overlay);
    const markerTestIds = Array.from(overlay.children).map((child) =>
      child.getAttribute('data-testid')
    );

    expect(markerTestIds).toEqual([
      CHART_SERIES_TEST_IDS.loadingExecutionMarker,
      CHART_SERIES_TEST_IDS.skippedExecutionMarker,
      CHART_RUN_POPOVER_TEST_IDS.skippedTrigger,
      CHART_SERIES_TEST_IDS.runMarker,
      CHART_RUN_POPOVER_TEST_IDS.runTrigger,
      CHART_SERIES_TEST_IDS.nextExecutionMarker,
      CHART_RUN_POPOVER_TEST_IDS.nextTrigger,
    ]);
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
      domain={mockDomain}
      cluster={mockCluster}
    />
  );
}
