import React from 'react';

import { render, screen, within } from '@/test-utils/rtl';

import {
  CHART_NOW_LINE_TEST_ID,
  CHART_REGION_ARIA_LABEL,
  CHART_SVG_TEST_ID,
  CHART_TOOLBAR_ARIA_LABEL,
  CHART_TOOLBAR_BUTTON_LABELS,
} from '../schedule-detail-metrics-chart.constants';
import ScheduleDetailMetricsChart from '../schedule-detail-metrics-chart';

jest.mock('@visx/responsive', () => ({
  ParentSize: ({
    children,
  }: {
    children: (args: { width: number; height: number }) => React.ReactNode;
  }) => <>{children({ width: 800, height: 280 })}</>,
}));

const mockNow = new Date('2024-06-15T12:00:00Z').getTime();

describe(ScheduleDetailMetricsChart.name, () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: mockNow });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders chart region with svg frame', () => {
    setup();

    expect(
      screen.getByRole('region', { name: CHART_REGION_ARIA_LABEL })
    ).toBeInTheDocument();
    expect(screen.getByTestId(CHART_SVG_TEST_ID)).toBeInTheDocument();
  });

  it('renders vertical now line in the chart svg', () => {
    setup();

    expect(screen.getByTestId(CHART_NOW_LINE_TEST_ID)).toBeInTheDocument();
  });

  it('renders disabled chart toolbar controls', () => {
    setup();

    const toolbar = screen.getByRole('toolbar', {
      name: CHART_TOOLBAR_ARIA_LABEL,
    });

    Object.values(CHART_TOOLBAR_BUTTON_LABELS).forEach((label) => {
      const button = within(toolbar).getByRole('button', { name: label });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });
});

function setup() {
  render(
    <ScheduleDetailMetricsChart
      params={{
        domain: 'test-domain',
        cluster: 'test-cluster',
        scheduleId: 'my-schedule',
        scheduleTab: 'runs',
      }}
    />
  );
}
