import React from 'react';

import { render, screen, within } from '@/test-utils/rtl';

import ScheduleDetailsRunsChart from '../schedule-details-runs-chart';
import {
  CHART_EMPTY_STATE_MESSAGE,
  CHART_REGION_ARIA_LABEL,
  CHART_TOOLBAR_ARIA_LABEL,
  CHART_TOOLBAR_BUTTON_LABELS,
} from '../schedule-details-runs-chart.constants';

let mockChartWidthPx = 800;

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
  () => jest.fn(() => <text>Mock series</text>)
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

function setup({ widthPx = 800 }: { widthPx?: number } = {}) {
  mockChartWidthPx = widthPx;

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
