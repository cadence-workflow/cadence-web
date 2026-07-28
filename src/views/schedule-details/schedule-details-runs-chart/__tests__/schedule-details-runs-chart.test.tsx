import React from 'react';

import { render, screen, within } from '@/test-utils/rtl';

import ScheduleDetailsRunsChart from '../schedule-details-runs-chart';
import {
  CHART_HEIGHT_PX,
  CHART_MAX_TICK_COUNT,
  CHART_NOW_MARKER_TEST_ID,
  CHART_REGION_ARIA_LABEL,
  CHART_TOOLBAR_ARIA_LABEL,
  CHART_TOOLBAR_BUTTON_LABELS,
} from '../schedule-details-runs-chart.constants';

const CHART_WIDTH_PX = 800;

jest.mock('@visx/responsive', () => ({
  useParentSize: () => ({
    parentRef: { current: null },
    width: CHART_WIDTH_PX,
    height: CHART_HEIGHT_PX,
  }),
}));

describe(ScheduleDetailsRunsChart.name, () => {
  it('labels the time axis with as many ticks as the width fits', () => {
    setup();

    expect(
      within(
        screen.getByRole('region', { name: CHART_REGION_ARIA_LABEL })
      ).getAllByText(/^\d{2}:\d{2}$/)
    ).toHaveLength(CHART_MAX_TICK_COUNT);
  });

  it('marks the current time inside the chart region', () => {
    setup();

    expect(
      within(
        screen.getByRole('region', { name: CHART_REGION_ARIA_LABEL })
      ).getByTestId(CHART_NOW_MARKER_TEST_ID)
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

function setup() {
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
