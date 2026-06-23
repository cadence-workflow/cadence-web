import React from 'react';

import { HttpResponse } from 'msw';

import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import { render, screen, waitFor } from '@/test-utils/rtl';

import {
  MOCK_CLUSTER,
  MOCK_DOMAIN,
  MOCK_SCHEDULE_ID,
  SCHEDULE_METRICS_CHART_API_FIXTURE_NOW_MS,
} from '../__fixtures__/schedule-detail-metrics-chart-api-fixture';
import {
  CHART_LOADING_SKELETON_TEST_ID,
  CHART_REGION_ARIA_LABEL,
  CHART_SERIES_TEST_IDS,
  CHART_SVG_TEST_ID,
} from '../schedule-detail-metrics-chart.constants';
import ScheduleDetailMetricsChart from '../schedule-detail-metrics-chart';

jest.mock('@visx/responsive', () => ({
  ParentSize: ({
    children,
  }: {
    children: (args: { width: number; height: number }) => React.ReactNode;
  }) => <>{children({ width: 800, height: 280 })}</>,
}));

describe(`${ScheduleDetailMetricsChart.name} empty workflows`, () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: SCHEDULE_METRICS_CHART_API_FIXTURE_NOW_MS });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders a default timeline when workflows are empty but describe succeeds', async () => {
    render(
      <ScheduleDetailMetricsChart
        params={{
          domain: MOCK_DOMAIN,
          cluster: MOCK_CLUSTER,
          scheduleId: MOCK_SCHEDULE_ID,
          scheduleTab: 'runs',
        }}
      />,
      {
        endpointsMocks: [
          {
            path: `/api/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}/schedules/${MOCK_SCHEDULE_ID}`,
            httpMethod: 'GET',
            httpResolver: async () =>
              HttpResponse.json(getMockRunningDescribeScheduleResponse()),
          },
          {
            path: `/api/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}/workflows`,
            httpMethod: 'GET',
            httpResolver: async () =>
              HttpResponse.json({ workflows: [], nextPage: '' }),
          },
        ],
      }
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });

    expect(
      screen.getByRole('region', { name: CHART_REGION_ARIA_LABEL })
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('schedule-metrics-chart-canvas')
    ).toBeInTheDocument();
    expect(screen.getByTestId(CHART_SVG_TEST_ID)).toBeInTheDocument();
    expect(
      screen.queryAllByTestId(CHART_SERIES_TEST_IDS.successfulRunMarker)
    ).toHaveLength(0);
  });
});
