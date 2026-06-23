import React from 'react';

import { HttpResponse } from 'msw';

import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import { render, screen, waitFor, within } from '@/test-utils/rtl';

import {
  getMockWorkflowPagesForChart,
  MOCK_CLUSTER,
  MOCK_DOMAIN,
  MOCK_SCHEDULE_ID,
  SCHEDULE_METRICS_CHART_API_FIXTURE_NOW_MS,
} from '../../schedule-detail-metrics-chart/__fixtures__/schedule-detail-metrics-chart-api-fixture';
import {
  CHART_LOADING_SKELETON_TEST_ID,
  CHART_REGION_ARIA_LABEL,
  CHART_TOOLBAR_ARIA_LABEL,
  CHART_TOOLBAR_BUTTON_LABELS,
} from '../../schedule-detail-metrics-chart/schedule-detail-metrics-chart.constants';
import SchedulePageTabContent from '../schedule-page-tab-content';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

jest.mock('@visx/responsive', () => ({
  ParentSize: ({
    children,
  }: {
    children: (args: { width: number; height: number }) => React.ReactNode;
  }) => <>{children({ width: 800, height: 280 })}</>,
}));

jest.mock('../../config/schedule-page-tabs.config', () =>
  jest.requireActual('../../config/schedule-page-tabs.config')
);

describe(`${SchedulePageTabContent.name} runs chart`, () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: SCHEDULE_METRICS_CHART_API_FIXTURE_NOW_MS });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders chart region and disabled toolbar controls on the runs tab', async () => {
    render(
      <SchedulePageTabContent
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
              HttpResponse.json(getMockWorkflowPagesForChart()[0]),
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
