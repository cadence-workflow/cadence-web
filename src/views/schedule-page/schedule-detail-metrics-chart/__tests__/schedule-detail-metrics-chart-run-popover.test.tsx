import React from 'react';

import { HttpResponse } from 'msw';
import { act } from '@testing-library/react';

import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import {
  getMockDescribeScheduleResponseForChart,
  getMockWorkflowPagesForChart,
  MOCK_CLUSTER,
  MOCK_DOMAIN,
  MOCK_SCHEDULE_ID,
  SCHEDULE_METRICS_CHART_API_FIXTURE_NOW_MS,
} from '../__fixtures__/schedule-detail-metrics-chart-api-fixture';
import {
  CHART_GLYPH_TEST_IDS,
  CHART_LOADING_SKELETON_TEST_ID,
  CHART_RUN_POPOVER_ENTRY_DELAY_MS,
} from '../schedule-detail-metrics-chart.constants';
import {
  RUN_POPOVER_BACKFILL_LABEL,
  RUN_POPOVER_TEST_IDS,
  RUN_POPOVER_TIMESTAMP_LABELS,
} from '../schedule-detail-metrics-chart-run-popover/schedule-detail-metrics-chart-run-popover.constants';
import ScheduleDetailMetricsChart from '../schedule-detail-metrics-chart';
import { WORKFLOW_STATUS_NAMES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

jest.mock('@visx/responsive', () => ({
  ParentSize: ({
    children,
  }: {
    children: (args: { width: number; height: number }) => React.ReactNode;
  }) => <>{children({ width: 800, height: 280 })}</>,
}));

describe(`${ScheduleDetailMetricsChart.name} run popover`, () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: SCHEDULE_METRICS_CHART_API_FIXTURE_NOW_MS });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows run details on hover over a successful run glyph', async () => {
    const { user } = setup({ workflowPages: getMockWorkflowPagesForChart() });

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });

    const triggers = screen.getAllByTestId(
      CHART_GLYPH_TEST_IDS.successfulRunTrigger
    );

    await user.hover(triggers[0]);
    act(() => {
      jest.advanceTimersByTime(CHART_RUN_POPOVER_ENTRY_DELAY_MS);
    });

    await waitFor(() => {
      expect(
        screen.getByTestId(RUN_POPOVER_TEST_IDS.content)
      ).toBeInTheDocument();
    });

    expect(screen.getByText('run-recent')).toBeInTheDocument();
    expect(screen.getByText(RUN_POPOVER_TIMESTAMP_LABELS.scheduled)).toBeInTheDocument();
    expect(screen.getByText(RUN_POPOVER_TIMESTAMP_LABELS.started)).toBeInTheDocument();
    expect(screen.getByText(RUN_POPOVER_TIMESTAMP_LABELS.ended)).toBeInTheDocument();
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
    const { user } = setup({ workflowPages: getMockWorkflowPagesForChart() });

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });

    const stackedTrigger = screen.getByRole('button', {
      name: /2 successful schedule runs/i,
    });

    await user.hover(stackedTrigger);
    act(() => {
      jest.advanceTimersByTime(CHART_RUN_POPOVER_ENTRY_DELAY_MS);
    });

    await waitFor(() => {
      expect(screen.getAllByTestId(RUN_POPOVER_TEST_IDS.runEntry)).toHaveLength(2);
    });

    expect(screen.getByText('run-stack-a')).toBeInTheDocument();
    expect(screen.getByText('run-stack-b')).toBeInTheDocument();
    expect(screen.getByText(RUN_POPOVER_BACKFILL_LABEL)).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('shows run details on focus over a missed execution glyph', async () => {
    const { user } = setup({ workflowPages: getMockWorkflowPagesForChart() });

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });

    const trigger = screen.getByTestId(
      CHART_GLYPH_TEST_IDS.missedExecutionTrigger
    );

    for (
      let tabCount = 0;
      tabCount < 12 && document.activeElement !== trigger;
      tabCount += 1
    ) {
      await user.tab();
    }

    expect(trigger).toHaveFocus();
    act(() => {
      jest.advanceTimersByTime(CHART_RUN_POPOVER_ENTRY_DELAY_MS);
    });

    await waitFor(() => {
      expect(screen.getByText('run-missed')).toBeInTheDocument();
    });
    expect(screen.getAllByText('—')).toHaveLength(1);
  });
});

function setup({
  workflowPages,
}: {
  workflowPages: Array<ListWorkflowsResponse>;
}) {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

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
            HttpResponse.json(getMockDescribeScheduleResponseForChart()),
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
      ],
    }
  );

  return { user };
}
