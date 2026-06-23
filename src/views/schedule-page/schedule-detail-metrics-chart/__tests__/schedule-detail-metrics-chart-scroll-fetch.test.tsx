import React from 'react';

import { act } from '@testing-library/react';
import { HttpResponse } from 'msw';

import { fireEvent, render, screen, waitFor } from '@/test-utils/rtl';

import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';

import {
  getMockDescribeScheduleResponseForChart,
  getMockWorkflowPagesForChart,
  MOCK_CLUSTER,
  MOCK_DOMAIN,
  MOCK_SCHEDULE_ID,
  SCHEDULE_METRICS_CHART_API_FIXTURE_NOW_MS,
} from '../__fixtures__/schedule-detail-metrics-chart-api-fixture';
import ScheduleDetailMetricsChart from '../schedule-detail-metrics-chart';
import {
  CHART_FETCH_LOADING_TEST_ID,
  CHART_LOADING_SKELETON_TEST_ID,
  CHART_SERIES_TEST_IDS,
} from '../schedule-detail-metrics-chart.constants';

jest.mock('@visx/responsive', () => ({
  ParentSize: ({
    children,
  }: {
    children: (args: { width: number; height: number }) => React.ReactNode;
  }) => <>{children({ width: 800, height: 280 })}</>,
}));

describe(`${ScheduleDetailMetricsChart.name} scroll fetch`, () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: SCHEDULE_METRICS_CHART_API_FIXTURE_NOW_MS });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('loads the next workflow page when panning horizontally into older time', async () => {
    const workflowPages = getMockWorkflowPagesForChart();
    const { getWorkflowRequestCount } = setup({ workflowPages });

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });

    expect(getWorkflowRequestCount()).toBe(1);
    expect(
      screen.getAllByTestId(CHART_SERIES_TEST_IDS.successfulRunMarker)
    ).toHaveLength(2);

    const canvas = screen.getByTestId('schedule-metrics-chart-canvas');

    await act(async () => {
      fireEvent.wheel(canvas, { deltaY: -4000 });
    });

    await waitFor(() => {
      expect(getWorkflowRequestCount()).toBeGreaterThan(1);
    });

    await waitFor(() => {
      expect(
        screen.getAllByTestId(CHART_SERIES_TEST_IDS.successfulRunMarker)
      ).toHaveLength(3);
    });

    expect(
      screen.queryByTestId(CHART_FETCH_LOADING_TEST_ID)
    ).not.toBeInTheDocument();
  });
});

function setup({
  workflowPages,
}: {
  workflowPages: Array<ListWorkflowsResponse>;
}) {
  let workflowRequestCount = 0;

  const utils = render(
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
            HttpResponse.json(getMockDescribeScheduleResponseForChart()),
        },
        {
          path: `/api/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}/workflows`,
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            const page =
              workflowPages[workflowRequestCount] ??
              workflowPages[workflowPages.length - 1];
            workflowRequestCount += 1;
            return HttpResponse.json(page);
          },
        },
      ],
    }
  );

  return {
    ...utils,
    getWorkflowRequestCount: () => workflowRequestCount,
  };
}
