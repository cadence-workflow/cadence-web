import React from 'react';

import { render, screen, within } from '@/test-utils/rtl';

import {
  CHART_EMPTY_STATE_MESSAGE,
  CHART_REGION_ARIA_LABEL,
  CHART_SERIES_TEST_IDS,
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

  it('renders chart canvas with static fixture series markers', () => {
    setup();

    expect(
      screen.getByRole('region', { name: CHART_REGION_ARIA_LABEL })
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('schedule-metrics-chart-canvas')
    ).toBeInTheDocument();
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
