import React from 'react';

import { render, screen, within } from '@/test-utils/rtl';

import ScheduleDetailsRunsChart from '../schedule-details-runs-chart';
import {
  CHART_EMPTY_STATE_MESSAGE,
  CHART_LOADING_TEST_ID,
  CHART_REGION_ARIA_LABEL,
  CHART_TOOLBAR_ARIA_LABEL,
  CHART_TOOLBAR_BUTTON_LABELS,
} from '../schedule-details-runs-chart.constants';

let mockChartWidthPx = 800;
let mockIsLoading = false;
let mockChartData: {
  runs: unknown[];
  skippedExecutions: unknown[];
  nextExecutionTimeMs: number | null;
} = {
  runs: [{ runId: 'run-1', scheduledTimeMs: Date.now(), status: 'x' }],
  skippedExecutions: [],
  nextExecutionTimeMs: null,
};

jest.mock('@visx/responsive', () => ({
  useParentSize: () => ({
    parentRef: { current: null },
    width: mockChartWidthPx,
  }),
}));

jest.mock(
  '../../schedule-details-runs-chart-timeline/schedule-details-runs-chart-timeline',
  () => jest.fn(() => <text>Mock timeline</text>)
);

jest.mock(
  '../../schedule-details-runs-chart-series/schedule-details-runs-chart-series',
  () => jest.fn(() => <div>Mock series</div>)
);

jest.mock(
  '@/views/schedule-details/hooks/use-schedule-runs-chart-data/use-schedule-runs-chart-data',
  () => () => ({ data: mockChartData, isLoading: mockIsLoading })
);

describe(ScheduleDetailsRunsChart.name, () => {
  it('draws the timeline once the region has been measured', () => {
    setup();

    expect(
      within(getChartRegion()).getByText('Mock timeline')
    ).toBeInTheDocument();
  });

  it('draws the series once the region has been measured', () => {
    setup();

    expect(
      within(getChartRegion()).getByText('Mock series')
    ).toBeInTheDocument();
  });

  it('falls back to the empty state while the region has no drawable width', () => {
    setup({ widthPx: 0 });

    expect(
      within(getChartRegion()).getByText(CHART_EMPTY_STATE_MESSAGE)
    ).toBeInTheDocument();
  });

  it('falls back to the empty state while there is no chart data', () => {
    setup({
      chartData: { runs: [], skippedExecutions: [], nextExecutionTimeMs: null },
    });

    expect(
      within(getChartRegion()).getByText(CHART_EMPTY_STATE_MESSAGE)
    ).toBeInTheDocument();
  });

  it('shows a loading skeleton while the schedule data is being fetched', () => {
    setup({ isLoading: true });

    expect(
      within(getChartRegion()).getByTestId(CHART_LOADING_TEST_ID)
    ).toBeInTheDocument();
    expect(
      within(getChartRegion()).queryByText('Mock series')
    ).not.toBeInTheDocument();
  });

  it('renders disabled toolbar controls', () => {
    setup();

    const toolbar = screen.getByRole('toolbar', {
      name: CHART_TOOLBAR_ARIA_LABEL,
    });

    Object.values(CHART_TOOLBAR_BUTTON_LABELS).forEach((label) => {
      expect(
        within(toolbar).getByRole('button', { name: label })
      ).toBeDisabled();
    });
  });
});

function setup({
  widthPx = 800,
  isLoading = false,
  chartData,
}: {
  widthPx?: number;
  isLoading?: boolean;
  chartData?: typeof mockChartData;
} = {}) {
  mockChartWidthPx = widthPx;
  mockIsLoading = isLoading;
  mockChartData = chartData ?? {
    runs: [{ runId: 'run-1', scheduledTimeMs: Date.now(), status: 'x' }],
    skippedExecutions: [],
    nextExecutionTimeMs: null,
  };

  render(
    <ScheduleDetailsRunsChart
      params={{
        domain: 'test-domain',
        cluster: 'test-cluster',
        scheduleId: 'my-schedule',
        scheduleTab: 'details',
      }}
    />
  );
}

function getChartRegion() {
  return screen.getByRole('region', { name: CHART_REGION_ARIA_LABEL });
}
