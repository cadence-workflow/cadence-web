import React from 'react';

import { render, screen, within } from '@/test-utils/rtl';

import ScheduleDetailsMetricsChart from '../schedule-details-metrics-chart';
import {
  CHART_EMPTY_STATE_MESSAGE,
  CHART_REGION_ARIA_LABEL,
  CHART_TOOLBAR_ARIA_LABEL,
  CHART_TOOLBAR_BUTTON_LABELS,
} from '../schedule-details-metrics-chart.constants';

describe(ScheduleDetailsMetricsChart.name, () => {
  it('renders the empty state inside the chart region', () => {
    setup();

    expect(
      within(
        screen.getByRole('region', { name: CHART_REGION_ARIA_LABEL })
      ).getByText(CHART_EMPTY_STATE_MESSAGE)
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
    <ScheduleDetailsMetricsChart
      params={{
        domain: 'test-domain',
        cluster: 'test-cluster',
        scheduleId: 'my-schedule',
        scheduleTab: 'details',
      }}
    />
  );
}
