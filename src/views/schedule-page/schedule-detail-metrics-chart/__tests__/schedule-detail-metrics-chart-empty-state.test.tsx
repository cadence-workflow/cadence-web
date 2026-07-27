import React from 'react';

import { HttpResponse } from 'msw';

import { render, screen, waitFor } from '@/test-utils/rtl';

import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';

import {
  MOCK_CLUSTER,
  MOCK_DOMAIN,
  MOCK_SCHEDULE_ID,
  SCHEDULE_METRICS_CHART_API_FIXTURE_NOW_MS,
} from '../__fixtures__/schedule-detail-metrics-chart-api-fixture';
import ScheduleDetailMetricsChart from '../schedule-detail-metrics-chart';
import {
  CHART_CANVAS_TEST_ID,
  CHART_GLYPH_TEST_IDS,
  CHART_LOADING_SKELETON_TEST_ID,
  CHART_REGION_ARIA_LABEL,
} from '../schedule-detail-metrics-chart.constants';

jest.mock('@visx/responsive', () => ({
  useParentSize: () => ({
    parentRef: { current: null },
    width: 800,
    height: 82,
  }),
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
            path: `/api/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}`,
            httpMethod: 'GET',
            httpResolver: async () =>
              HttpResponse.json({
                workflowExecutionRetentionPeriod: {
                  seconds: String(24 * 60 * 60),
                  nanos: 0,
                },
              }),
          },
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
    expect(screen.getByTestId(CHART_CANVAS_TEST_ID)).toBeInTheDocument();
    expect(
      screen.queryAllByTestId(CHART_GLYPH_TEST_IDS.runTrigger)
    ).toHaveLength(0);
  });
});
