import React from 'react';

import { HttpResponse } from 'msw';

import { render, screen, within } from '@/test-utils/rtl';

import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';
import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';

import ScheduleDetailsRunsChart from '../schedule-details-runs-chart';
import {
  CHART_EMPTY_STATE_MESSAGE,
  CHART_LOADING_TEST_ID,
  CHART_REGION_ARIA_LABEL,
  CHART_TOOLBAR_ARIA_LABEL,
  CHART_TOOLBAR_BUTTON_LABELS,
} from '../schedule-details-runs-chart.constants';

const mockDomain = 'test-domain';
const mockCluster = 'test-cluster';
const mockScheduleId = 'my-schedule';
const nowMs = Date.UTC(2024, 0, 1, 12, 0);
const hourMs = 60 * 60_000;

const describeScheduleWithNextRun = getMockRunningDescribeScheduleResponse({
  info: {
    lastRunTime: null,
    nextRunTime: { seconds: String((nowMs + hourMs) / 1000), nanos: 0 },
    totalRuns: '1',
    createTime: null,
    lastUpdateTime: null,
    missedRuns: '0',
    skippedRuns: '0',
    ongoingBackfills: [],
  },
});

const workflowsWithRun: ListWorkflowsResponse = {
  workflows: [
    getMockWorkflowListItem({
      workflowID: 'wf-1',
      runID: 'run-1',
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
      startTime: nowMs - hourMs,
      closeTime: nowMs - hourMs + 1000,
      historyLength: 5,
      searchAttributes: {
        CadenceScheduleTime: {
          data: Buffer.from(
            JSON.stringify(new Date(nowMs - hourMs).toISOString())
          ).toString('base64'),
        },
      },
    }),
  ],
  nextPage: '',
};

const emptyWorkflows: ListWorkflowsResponse = {
  workflows: [],
  nextPage: '',
};

let mockChartWidthPx = 800;

jest.mock('@visx/responsive', () => ({
  useParentSize: () => ({
    parentRef: { current: null },
    width: mockChartWidthPx,
  }),
}));

jest.mock('@/hooks/use-current-time-ms/use-current-time-ms', () => () => nowMs);

jest.mock(
  '../../schedule-details-runs-chart-timeline/schedule-details-runs-chart-timeline',
  () => jest.fn(() => <text>Mock timeline</text>)
);

jest.mock(
  '../../schedule-details-runs-chart-series/schedule-details-runs-chart-series',
  () => jest.fn(() => <div>Mock series</div>)
);

describe(ScheduleDetailsRunsChart.name, () => {
  it('draws the timeline once the region has been measured', async () => {
    setup();

    expect(
      await within(getChartRegion()).findByText('Mock timeline')
    ).toBeInTheDocument();
  });

  it('draws the series once the region has been measured', async () => {
    setup();

    expect(
      await within(getChartRegion()).findByText('Mock series')
    ).toBeInTheDocument();
  });

  it('falls back to the empty state while the region has no drawable width', async () => {
    setup({ widthPx: 0 });

    expect(
      await within(getChartRegion()).findByText(CHART_EMPTY_STATE_MESSAGE)
    ).toBeInTheDocument();
  });

  it('falls back to the empty state while there is no chart data', async () => {
    setup({
      describeScheduleResponse: getMockRunningDescribeScheduleResponse(),
      workflowsResponse: emptyWorkflows,
    });

    expect(
      await within(getChartRegion()).findByText(CHART_EMPTY_STATE_MESSAGE)
    ).toBeInTheDocument();
  });

  it('shows a loading skeleton while the schedule data is being fetched', () => {
    setup({ isLoading: true });

    expect(
      within(getChartRegion()).getByTestId(CHART_LOADING_TEST_ID)
    ).toBeInTheDocument();
    expect(
      within(getChartRegion()).queryByText('Mock series')
    ).not.toBeInTheDocument();
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

function setup({
  widthPx = 800,
  isLoading = false,
  describeScheduleResponse = describeScheduleWithNextRun,
  workflowsResponse = workflowsWithRun,
}: {
  widthPx?: number;
  isLoading?: boolean;
  describeScheduleResponse?: DescribeScheduleResponse;
  workflowsResponse?: ListWorkflowsResponse;
} = {}) {
  mockChartWidthPx = widthPx;

  render(
    <ScheduleDetailsRunsChart
      params={{
        domain: mockDomain,
        cluster: mockCluster,
        scheduleId: mockScheduleId,
        scheduleTab: 'details',
      }}
    />,
    {
      endpointsMocks: getChartDataEndpointMocks({
        isLoading,
        describeScheduleResponse,
        workflowsResponse,
      }),
    }
  );
}

function getChartDataEndpointMocks({
  isLoading,
  describeScheduleResponse,
  workflowsResponse,
}: {
  isLoading: boolean;
  describeScheduleResponse: DescribeScheduleResponse;
  workflowsResponse: ListWorkflowsResponse;
}) {
  const pendingResponse = () => new Promise<never>(() => {});

  return [
    {
      path: `/api/domains/${mockDomain}/${mockCluster}/schedules/${mockScheduleId}`,
      httpMethod: 'GET' as const,
      mockOnce: false,
      httpResolver: async () => {
        if (isLoading) {
          return pendingResponse();
        }

        return HttpResponse.json(describeScheduleResponse);
      },
    },
    {
      path: `/api/domains/${mockDomain}/${mockCluster}/workflows`,
      httpMethod: 'GET' as const,
      mockOnce: false,
      httpResolver: async () => {
        if (isLoading) {
          return pendingResponse();
        }

        return HttpResponse.json(workflowsResponse);
      },
    },
  ];
}

function getChartRegion() {
  return screen.getByRole('region', { name: CHART_REGION_ARIA_LABEL });
}
