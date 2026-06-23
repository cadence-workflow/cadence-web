import React from 'react';

import { render, screen, within } from '@/test-utils/rtl';

import {
  CHART_NOW_LINE_TEST_ID,
  CHART_REGION_ARIA_LABEL,
  CHART_SERIES_TEST_IDS,
  CHART_SVG_TEST_ID,
  CHART_TOOLBAR_ARIA_LABEL,
  CHART_TOOLBAR_BUTTON_LABELS,
} from '../schedule-detail-metrics-chart.constants';
import { SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS } from '../__fixtures__/schedule-detail-metrics-chart-fixture';
import ScheduleDetailMetricsChart from '../schedule-detail-metrics-chart';

jest.mock('@visx/responsive', () => ({
  ParentSize: ({
    children,
  }: {
    children: (args: { width: number; height: number }) => React.ReactNode;
  }) => <>{children({ width: 800, height: 280 })}</>,
}));

describe(ScheduleDetailMetricsChart.name, () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders chart region with svg frame and static fixture series markers', () => {
    setup();

    expect(
      screen.getByRole('region', { name: CHART_REGION_ARIA_LABEL })
    ).toBeInTheDocument();
    expect(screen.getByTestId(CHART_SVG_TEST_ID)).toBeInTheDocument();
    expect(
      screen.getByTestId(CHART_SERIES_TEST_IDS.svg)
    ).toBeInTheDocument();
    expect(
      screen.getAllByTestId(CHART_SERIES_TEST_IDS.successfulRunMarker)
    ).toHaveLength(3);
    expect(
      screen.getByTestId(CHART_SERIES_TEST_IDS.missedExecutionMarker)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(CHART_SERIES_TEST_IDS.nextExecutionMarker)
    ).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders x and y axes in the chart svg', () => {
    setup();

    const chartSvg = screen.getByTestId(CHART_SVG_TEST_ID);

    expect(within(chartSvg).getAllByText(/\d{2}:\d{2}/).length).toBeGreaterThan(
      0
    );
    expect(within(chartSvg).getAllByText(/^\d+$/).length).toBeGreaterThan(0);
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
