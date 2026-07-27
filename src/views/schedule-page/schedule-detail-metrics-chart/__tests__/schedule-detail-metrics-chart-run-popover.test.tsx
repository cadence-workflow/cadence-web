import React from 'react';

import { act } from '@testing-library/react';
import { HttpResponse } from 'msw';

import {
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '@/test-utils/rtl';

import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import { WORKFLOW_STATUS_NAMES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

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
  RUN_POPOVER_BACKFILL_LABEL,
  RUN_POPOVER_TEST_IDS,
  RUN_POPOVER_TIMESTAMP_LABELS,
} from '../schedule-detail-metrics-chart-run-popover.constants';
import {
  CHART_GLYPH_TEST_IDS,
  CHART_LOADING_SKELETON_TEST_ID,
  CHART_RUN_POPOVER_ENTRY_DELAY_MS,
} from '../schedule-detail-metrics-chart.constants';

jest.mock('@visx/responsive', () => ({
  useParentSize: () => ({
    parentRef: { current: null },
    width: 1600,
    height: 82,
  }),
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

    const triggers = screen.getAllByTestId(CHART_GLYPH_TEST_IDS.runTrigger);

    await user.hover(triggers[0]);
    act(() => {
      jest.advanceTimersByTime(CHART_RUN_POPOVER_ENTRY_DELAY_MS);
    });

    await waitFor(() => {
      expect(
        screen.getByTestId(RUN_POPOVER_TEST_IDS.content)
      ).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: 'run-recent' })).toHaveAttribute(
      'href',
      `/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}/workflows/wf-recent/run-recent`
    );
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
      within(screen.getByTestId(RUN_POPOVER_TEST_IDS.runEntry)).getByText(
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
      name: /2 schedule runs/i,
    });

    await user.hover(stackedTrigger);
    act(() => {
      jest.advanceTimersByTime(CHART_RUN_POPOVER_ENTRY_DELAY_MS);
    });

    await waitFor(() => {
      expect(screen.getAllByTestId(RUN_POPOVER_TEST_IDS.runEntry)).toHaveLength(
        2
      );
    });

    expect(screen.getByText('run-stack-a')).toBeInTheDocument();
    expect(screen.getByText('run-stack-b')).toBeInTheDocument();
    expect(screen.getByText(RUN_POPOVER_BACKFILL_LABEL)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'backfill-abc-123' })
    ).toHaveAttribute(
      'href',
      `/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}/workflows?input=query&query=${encodeURIComponent(`CadenceScheduleID = "${MOCK_SCHEDULE_ID}" AND CadenceScheduleBackfillID = "backfill-abc-123"`)}`
    );
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });

  it('does not propagate text-selection pointer events to the chart', async () => {
    const { user } = setup({ workflowPages: getMockWorkflowPagesForChart() });
    const documentPointerDown = jest.fn();
    document.addEventListener('pointerdown', documentPointerDown);

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });
    await user.hover(screen.getAllByTestId(CHART_GLYPH_TEST_IDS.runTrigger)[0]);
    act(() => {
      jest.advanceTimersByTime(CHART_RUN_POPOVER_ENTRY_DELAY_MS);
    });
    const content = await screen.findByTestId(RUN_POPOVER_TEST_IDS.content);

    fireEvent.pointerDown(content);

    expect(documentPointerDown).not.toHaveBeenCalled();
    document.removeEventListener('pointerdown', documentPointerDown);
  });

  it('shows a running spinner for a zero-history open workflow', async () => {
    const { user } = setup({ workflowPages: getMockWorkflowPagesForChart() });

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });

    const trigger = screen.getByRole('button', {
      name: 'Schedule run run-missed',
    });

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
    expect(
      within(screen.getByTestId(RUN_POPOVER_TEST_IDS.runEntry)).getByText(
        WORKFLOW_STATUS_NAMES.WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID
      )
    ).toBeInTheDocument();
    expect(
      screen
        .getByTestId(RUN_POPOVER_TEST_IDS.statusIcon)
        .querySelector('[role="progressbar"]')
    ).toBeInTheDocument();
    expect(screen.getAllByText('-')).toHaveLength(1);
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
