import React from 'react';

import { act } from '@testing-library/react';
import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import { WORKFLOW_STATUS_NAMES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import {
  RUN_POPOVER_BACKFILL_LABEL,
  RUN_POPOVER_EMPTY_VALUE,
  RUN_POPOVER_NEXT_LABEL,
  RUN_POPOVER_SKIPPED_LABEL,
  RUN_POPOVER_TEST_IDS,
  RUN_POPOVER_TIMESTAMP_LABELS,
} from '../../schedule-details-runs-chart-run-popover/schedule-details-runs-chart-run-popover.constants';
import {
  getMockDescribeScheduleResponseForRunsChartPopover,
  getMockDescribeScheduleResponseForRunsChartPopoverWithSkipped,
  getMockWorkflowPagesForRunsChartPopover,
  getMockWorkflowPagesForRunsChartPopoverWithSkipped,
  MOCK_CLUSTER,
  MOCK_DOMAIN,
  MOCK_SCHEDULE_ID,
  SCHEDULE_RUNS_CHART_POPOVER_FIXTURE_NOW_MS,
} from '../__fixtures__/schedule-details-runs-chart-popover-fixture';
import ScheduleDetailsRunsChart from '../schedule-details-runs-chart';
import {
  CHART_LOADING_TEST_ID,
  CHART_RUN_POPOVER_ENTRY_DELAY_MS,
} from '../schedule-details-runs-chart.constants';

const mockChartWidthPx = 800;

jest.mock('@visx/responsive', () => ({
  useParentSize: () => ({
    parentRef: { current: null },
    width: mockChartWidthPx,
  }),
}));

jest.mock(
  '@/hooks/use-current-time-ms/use-current-time-ms',
  () => () => SCHEDULE_RUNS_CHART_POPOVER_FIXTURE_NOW_MS
);

describe(`${ScheduleDetailsRunsChart.name} run popover`, () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: SCHEDULE_RUNS_CHART_POPOVER_FIXTURE_NOW_MS });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows run details on hover over a run glyph', async () => {
    const { user } = setup({
      workflowPages: getMockWorkflowPagesForRunsChartPopover(),
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_TEST_ID)
      ).not.toBeInTheDocument();
    });

    const recentTrigger = screen.getByRole('button', {
      name: /Completed schedule run at 2024-01-01T11:00:00.000Z/i,
    });

    await user.hover(recentTrigger);
    act(() => {
      jest.advanceTimersByTime(CHART_RUN_POPOVER_ENTRY_DELAY_MS);
    });

    await waitFor(() => {
      expect(
        screen.getByTestId(RUN_POPOVER_TEST_IDS.content)
      ).toBeInTheDocument();
    });

    expect(screen.getByText('run-recent')).toBeInTheDocument();
    expect(
      screen.getByText(RUN_POPOVER_TIMESTAMP_LABELS.scheduled)
    ).toBeInTheDocument();
    expect(
      screen.getByText(RUN_POPOVER_TIMESTAMP_LABELS.started)
    ).toBeInTheDocument();
    expect(
      screen.getByText(RUN_POPOVER_TIMESTAMP_LABELS.ended)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        WORKFLOW_STATUS_NAMES.WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED
      )
    ).toBeInTheDocument();
    expect(screen.getAllByTestId(RUN_POPOVER_TEST_IDS.statusIcon)).toHaveLength(
      1
    );
  });

  it('lists multiple runs in a stack when several share the same scheduled time', async () => {
    const { user } = setup({
      workflowPages: getMockWorkflowPagesForRunsChartPopover(),
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_TEST_ID)
      ).not.toBeInTheDocument();
    });

    const stackedTrigger = screen.getByRole('button', {
      name: /2 schedule runs at/i,
    });

    await user.hover(stackedTrigger);
    act(() => {
      jest.advanceTimersByTime(CHART_RUN_POPOVER_ENTRY_DELAY_MS);
    });

    await waitFor(() => {
      expect(screen.getAllByTestId(RUN_POPOVER_TEST_IDS.entry)).toHaveLength(2);
    });

    expect(screen.getByRole('link', { name: 'run-stack-a' })).toHaveAttribute(
      'href',
      `/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}/workflows/wf-stack-a/run-stack-a`
    );
    expect(
      screen.getByRole('link', { name: 'run-stack-b' })
    ).toBeInTheDocument();
    expect(screen.getByText(RUN_POPOVER_BACKFILL_LABEL)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'backfill-abc-123' })
    ).toBeInTheDocument();
  });

  it('shows run details on focus over a run glyph', async () => {
    const { user } = setup({
      workflowPages: getMockWorkflowPagesForRunsChartPopover(),
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_TEST_ID)
      ).not.toBeInTheDocument();
    });

    const recentTrigger = screen.getByRole('button', {
      name: /Completed schedule run at 2024-01-01T11:00:00.000Z/i,
    });

    for (
      let tabCount = 0;
      tabCount < 12 && document.activeElement !== recentTrigger;
      tabCount += 1
    ) {
      await user.tab();
    }

    expect(recentTrigger).toHaveFocus();
    act(() => {
      jest.advanceTimersByTime(CHART_RUN_POPOVER_ENTRY_DELAY_MS);
    });

    await waitFor(() => {
      expect(screen.getByText('run-recent')).toBeInTheDocument();
    });
  });

  it('shows skipped run schedule time on hover', async () => {
    const { user } = setup({
      workflowPages: getMockWorkflowPagesForRunsChartPopoverWithSkipped(),
      describeScheduleResponse:
        getMockDescribeScheduleResponseForRunsChartPopoverWithSkipped(),
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_TEST_ID)
      ).not.toBeInTheDocument();
    });

    const skippedTrigger = screen.getByRole('button', {
      name: /Skipped run at 2024-01-01T09:00:00.000Z/i,
    });

    await user.hover(skippedTrigger);
    act(() => {
      jest.advanceTimersByTime(CHART_RUN_POPOVER_ENTRY_DELAY_MS);
    });

    await waitFor(() => {
      expect(
        screen.getByTestId(RUN_POPOVER_TEST_IDS.content)
      ).toBeInTheDocument();
    });

    expect(screen.getByText(RUN_POPOVER_SKIPPED_LABEL)).toBeInTheDocument();
    expect(
      screen.getByText(RUN_POPOVER_TIMESTAMP_LABELS.scheduled)
    ).toBeInTheDocument();
    expect(screen.getAllByText(RUN_POPOVER_EMPTY_VALUE)).toHaveLength(2);
  });

  it('shows next run schedule time on hover', async () => {
    const { user } = setup({
      workflowPages: getMockWorkflowPagesForRunsChartPopover(),
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_TEST_ID)
      ).not.toBeInTheDocument();
    });

    const nextTrigger = screen.getByRole('button', {
      name: /Next run at 2024-01-01T13:00:00.000Z/i,
    });

    await user.hover(nextTrigger);
    act(() => {
      jest.advanceTimersByTime(CHART_RUN_POPOVER_ENTRY_DELAY_MS);
    });

    await waitFor(() => {
      expect(
        screen.getByTestId(RUN_POPOVER_TEST_IDS.content)
      ).toBeInTheDocument();
    });

    expect(screen.getByText(RUN_POPOVER_NEXT_LABEL)).toBeInTheDocument();
    expect(
      screen.getByText(RUN_POPOVER_TIMESTAMP_LABELS.scheduled)
    ).toBeInTheDocument();
    expect(screen.getAllByText(RUN_POPOVER_EMPTY_VALUE)).toHaveLength(2);
  });
});

function setup({
  workflowPages,
  describeScheduleResponse = getMockDescribeScheduleResponseForRunsChartPopover(),
}: {
  workflowPages: Array<ListWorkflowsResponse>;
  describeScheduleResponse?: ReturnType<
    typeof getMockDescribeScheduleResponseForRunsChartPopover
  >;
}) {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  render(
    <ScheduleDetailsRunsChart
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
          httpResolver: async () => HttpResponse.json(describeScheduleResponse),
        },
        {
          path: `/api/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}/workflows`,
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () =>
            HttpResponse.json(
              workflowPages[0] ?? { workflows: [], nextPage: '' }
            ),
        },
        {
          path: `/api/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}`,
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () =>
            HttpResponse.json({
              workflowExecutionRetentionPeriod: {
                seconds: '604800',
                nanos: 0,
              },
            }),
        },
      ],
    }
  );

  return { user };
}
