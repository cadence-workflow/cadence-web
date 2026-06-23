import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import {
  CHART_EMPTY_STATE_MESSAGE,
  CHART_REGION_ARIA_LABEL,
} from '../schedule-detail-metrics-chart.constants';
import ScheduleDetailMetricsChart from '../schedule-detail-metrics-chart';

jest.mock('@visx/responsive', () => ({
  ParentSize: ({
    children,
  }: {
    children: (args: { width: number; height: number }) => React.ReactNode;
  }) => <>{children({ width: 800, height: 280 })}</>,
}));

jest.mock('../__fixtures__/schedule-detail-metrics-chart-fixture', () => ({
  SCHEDULE_METRICS_CHART_FIXTURE_NOW_MS: new Date(
    '2024-06-15T12:00:00.000Z'
  ).getTime(),
  scheduleMetricsChartFixture: {
    successfulRuns: [],
    missedExecutions: [],
    nextExecutionTimeMs: null,
  },
}));

describe(`${ScheduleDetailMetricsChart.name} empty state`, () => {
  it('renders empty state when there is no chart data', () => {
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

    expect(
      screen.getByRole('region', { name: CHART_REGION_ARIA_LABEL })
    ).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(
      CHART_EMPTY_STATE_MESSAGE
    );
    expect(
      screen.queryByTestId('schedule-metrics-chart-canvas')
    ).not.toBeInTheDocument();
  });
});
