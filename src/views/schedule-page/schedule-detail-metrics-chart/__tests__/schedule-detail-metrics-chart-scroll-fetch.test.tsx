import React from 'react';

import { act } from '@testing-library/react';
import { HttpResponse } from 'msw';

import {
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '@/test-utils/rtl';

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
  CHART_CANVAS_TEST_ID,
  CHART_FETCH_RETRY_LABEL,
  CHART_FETCH_LOADING_TEST_ID,
  CHART_LOADING_SKELETON_TEST_ID,
  CHART_SUMMARY_TEST_ID,
} from '../schedule-detail-metrics-chart.constants';

jest.mock('@visx/responsive', () => ({
  useParentSize: () => ({
    parentRef: { current: null },
    width: 800,
    height: 82,
  }),
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
    expect(screen.getByTestId(CHART_SUMMARY_TEST_ID)).toHaveTextContent('Runs');

    const canvas = screen.getByTestId(CHART_CANVAS_TEST_ID);

    await act(async () => {
      fireEvent.wheel(canvas, { deltaY: -4000 });
    });

    await waitFor(() => {
      expect(getWorkflowRequestCount()).toBeGreaterThan(1);
    });

    expect(
      screen.queryByTestId(CHART_FETCH_LOADING_TEST_ID)
    ).not.toBeInTheDocument();
  });

  it('allows retrying after loading the next workflow page fails', async () => {
    const workflowPages = getMockWorkflowPagesForChart();
    const { getWorkflowRequestCount, user } = setup({
      workflowPages,
      failedWorkflowRequestIndexes: new Set([1]),
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.wheel(screen.getByTestId(CHART_CANVAS_TEST_ID), {
        deltaY: -4000,
      });
    });

    expect(
      await screen.findByRole('button', { name: CHART_FETCH_RETRY_LABEL })
    ).toBeInTheDocument();
    expect(getWorkflowRequestCount()).toBe(2);

    await user.click(
      screen.getByRole('button', { name: CHART_FETCH_RETRY_LABEL })
    );

    await waitFor(() => {
      expect(getWorkflowRequestCount()).toBe(3);
      expect(
        screen.queryByRole('button', { name: CHART_FETCH_RETRY_LABEL })
      ).not.toBeInTheDocument();
    });
  });
});

function setup({
  workflowPages,
  failedWorkflowRequestIndexes = new Set(),
}: {
  workflowPages: Array<ListWorkflowsResponse>;
  failedWorkflowRequestIndexes?: Set<number>;
}) {
  let workflowRequestCount = 0;
  const user = userEvent.setup({
    advanceTimers: jest.advanceTimersByTime,
  });

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
            HttpResponse.json(getMockDescribeScheduleResponseForChart()),
        },
        {
          path: `/api/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}/workflows`,
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            const requestIndex = workflowRequestCount;
            workflowRequestCount += 1;

            if (failedWorkflowRequestIndexes.has(requestIndex)) {
              return HttpResponse.json(
                { message: 'Failed to load workflows' },
                { status: 500 }
              );
            }

            const page =
              workflowPages[requestIndex] ??
              workflowPages[workflowPages.length - 1];
            return HttpResponse.json(page);
          },
        },
      ],
    }
  );

  return {
    ...utils,
    user,
    getWorkflowRequestCount: () => workflowRequestCount,
  };
}
