import React from 'react';

import { act } from '@testing-library/react';
import { HttpResponse } from 'msw';

import { render, screen, userEvent, within, waitFor } from '@/test-utils/rtl';

import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';
import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import formatDate from '@/utils/data-formatters/format-date';
import { SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN } from '@/views/shared/hooks/use-list-workflows-for-schedule/use-list-workflows-for-schedule.constants';

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
  CHART_GLYPH_TEST_IDS,
  CHART_LIVE_REFRESH_INTERVAL_MS,
  CHART_LOADING_SKELETON_TEST_ID,
  CHART_REGION_ARIA_LABEL,
  CHART_SERIES_TEST_IDS,
  CHART_SUMMARY_TEST_ID,
  CHART_TOOLBAR_ARIA_LABEL,
  CHART_TOOLBAR_BUTTON_LABELS,
  CURRENT_TIME_UPDATE_INTERVAL_MS,
} from '../schedule-detail-metrics-chart.constants';

jest.mock('@visx/responsive', () => ({
  useParentSize: () => ({
    parentRef: { current: null },
    width: 1600,
    height: 82,
  }),
}));

describe(ScheduleDetailMetricsChart.name, () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: SCHEDULE_METRICS_CHART_API_FIXTURE_NOW_MS });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the compact timeline with labels and status markers', async () => {
    setup();

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });

    expect(
      screen.getByRole('region', { name: CHART_REGION_ARIA_LABEL })
    ).toBeInTheDocument();
    expect(screen.getByTestId(CHART_CANVAS_TEST_ID)).toBeInTheDocument();
    expect(screen.getByTestId(CHART_SERIES_TEST_IDS.svg)).toBeInTheDocument();
    const runMarkers = screen.getAllByTestId(CHART_GLYPH_TEST_IDS.runTrigger);
    expect(runMarkers.map((marker) => marker.dataset.statusVariant)).toEqual(
      expect.arrayContaining([
        'completed',
        'failed',
        'running',
        'canceled',
        'grouped',
      ])
    );
    const timedOutMarker = runMarkers.find(
      (marker) =>
        marker.getAttribute('aria-label') === 'Schedule run run-timed-out'
    );
    expect(timedOutMarker).toHaveAttribute('data-status-variant', 'failed');
    expect(timedOutMarker).not.toHaveAttribute('data-is-backfill');
    const backfillMarker = runMarkers.find(
      (marker) =>
        marker.getAttribute('aria-label') === 'Schedule run run-backfill'
    );
    expect(backfillMarker).toHaveAccessibleName('Schedule run run-backfill');
    expect(backfillMarker).toHaveAttribute('data-is-backfill', 'true');
    expect(backfillMarker).toHaveAttribute('data-status-variant', 'completed');
    const groupedMarker = runMarkers.find(
      (marker) => marker.dataset.statusVariant === 'grouped'
    );
    expect(groupedMarker).toHaveTextContent('2');
    const runningMarker = runMarkers.find(
      (marker) => marker.dataset.statusVariant === 'running'
    );
    expect(runningMarker).toHaveStyle({ cursor: 'pointer' });
    expect(screen.getAllByText('Jan 1,')).toHaveLength(7);
    expect(
      screen.getByTestId(CHART_SERIES_TEST_IDS.nowMarker)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(CHART_SERIES_TEST_IDS.nextExecutionMarker)
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
    ).not.toBeInTheDocument();
  });

  it('shows the scheduled time for skipped runs', async () => {
    const { user } = setup();

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });

    const skippedMarker = screen.getAllByTestId(
      CHART_GLYPH_TEST_IDS.skippedExecutionTrigger
    )[0];
    const scheduledTimeMs = Date.parse(
      skippedMarker
        .getAttribute('aria-label')
        ?.replace('Skipped run at ', '') ?? ''
    );

    await user.hover(skippedMarker);

    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      `Skipped run: ${formatDate(scheduledTimeMs)}`
    );
  });

  it('shows the scheduled time for the next run', async () => {
    const { user } = setup();

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });

    const nextRunAnchor = screen.getByLabelText(/^Next run at /);
    const scheduledTimeMs = Date.parse(
      nextRunAnchor.getAttribute('aria-label')?.replace('Next run at ', '') ??
        ''
    );

    await user.hover(nextRunAnchor);

    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      `Next run: ${formatDate(scheduledTimeMs)}`
    );
  });

  it('hides the stale next run while paused', async () => {
    const describeScheduleResponse = getMockDescribeScheduleResponseForChart();

    setup({
      describeScheduleResponse: {
        ...describeScheduleResponse,
        state: { paused: true, pauseInfo: null },
      },
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });

    expect(
      screen.queryByTestId(CHART_SERIES_TEST_IDS.nextExecutionMarker)
    ).not.toBeInTheDocument();
  });

  it('renders an uncounted legend for the partially loaded run data', async () => {
    setup();

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });

    const summary = screen.getByTestId(CHART_SUMMARY_TEST_ID);
    expect(within(summary).getByText('Runs')).toBeInTheDocument();
    expect(within(summary).getByText('Completed')).toBeInTheDocument();
    expect(within(summary).getByText('Terminated/Failed')).toBeInTheDocument();
    expect(within(summary).getByText('Running')).toBeInTheDocument();
    expect(within(summary).getByText('Cancelled')).toBeInTheDocument();
    expect(within(summary).queryByText('Timed out')).not.toBeInTheDocument();
    expect(within(summary).queryByText('Backfills')).not.toBeInTheDocument();
    expect(within(summary).getByText('Skipped')).toBeInTheDocument();
    expect(within(summary).getByText('Next run')).toBeInTheDocument();
    expect(summary).not.toHaveTextContent(/\d/);
  });

  it('orders the labeled controls to match the design', async () => {
    setup();

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });

    expect(
      within(screen.getByRole('toolbar', { name: CHART_TOOLBAR_ARIA_LABEL }))
        .getAllByRole('button')
        .map((button) => button.textContent)
    ).toEqual(['Zoom out', 'Zoom in', 'Now']);
  });

  it('updates the current-time indicator as time advances', async () => {
    setup();

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });

    const getCurrentTimeX = () =>
      screen.getByTestId(CHART_SERIES_TEST_IDS.nowMarker).getAttribute('x1');
    const initialX = getCurrentTimeX();

    act(() => {
      jest.advanceTimersByTime(CURRENT_TIME_UPDATE_INTERVAL_MS);
    });

    expect(getCurrentTimeX()).not.toBe(initialX);
  });

  it('keeps the next-run marker visible when its time advances', async () => {
    const initialDescribe = getMockDescribeScheduleResponseForChart();
    const updatedDescribe: DescribeScheduleResponse = {
      ...initialDescribe,
      info: initialDescribe.info
        ? {
            ...initialDescribe.info,
            nextRunTime: { seconds: '23400', nanos: 0 },
          }
        : null,
    };

    setup({
      describeScheduleResponses: [initialDescribe, updatedDescribe],
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });

    const getNextRunDistanceFromNowPx = () =>
      Number(
        screen.getByTestId(CHART_SERIES_TEST_IDS.nextExecutionMarker).dataset
          .chartX
      ) -
      Number(
        screen.getByTestId(CHART_SERIES_TEST_IDS.nowMarker).getAttribute('x1')
      );
    const initialDistancePx = getNextRunDistanceFromNowPx();

    await act(async () => {
      await jest.advanceTimersByTimeAsync(CHART_LIVE_REFRESH_INTERVAL_MS);
    });

    await waitFor(() => {
      expect(getNextRunDistanceFromNowPx()).toBeGreaterThan(initialDistancePx);
    });
  });

  it('adds new run glyphs when the latest workflow page refreshes', async () => {
    const initialPage = getMockWorkflowPagesForChart()[0];
    const refreshedPage = {
      ...initialPage,
      workflows: [
        getMockWorkflowListItem({
          workflowID: 'wf-live',
          runID: 'run-live',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
          historyLength: 10,
          startTime: 5.5 * 60 * 60 * 1000,
          searchAttributes: {
            [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: {
              data: String(5.5 * 60 * 60 * 1000),
            },
          },
        }),
        ...(initialPage.workflows ?? []),
      ],
    };
    const { getLatestWorkflowRequestCount } = setup({
      latestPages: [initialPage, refreshedPage],
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });

    expect(screen.getAllByTestId(CHART_GLYPH_TEST_IDS.runTrigger)).toHaveLength(
      8
    );

    await act(async () => {
      await jest.advanceTimersByTimeAsync(CHART_LIVE_REFRESH_INTERVAL_MS);
    });

    await waitFor(() => {
      expect(
        screen.getAllByTestId(CHART_GLYPH_TEST_IDS.runTrigger)
      ).toHaveLength(9);
    });
    expect(getLatestWorkflowRequestCount()).toBe(2);
  });

  it('allows zooming out beyond the initial readable view', async () => {
    setup();

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });

    const toolbar = screen.getByRole('toolbar', {
      name: CHART_TOOLBAR_ARIA_LABEL,
    });

    expect(
      within(toolbar).getByRole('button', {
        name: CHART_TOOLBAR_BUTTON_LABELS.zoomIn,
      })
    ).toBeEnabled();
    expect(
      within(toolbar).getByRole('button', {
        name: CHART_TOOLBAR_BUTTON_LABELS.zoomOut,
      })
    ).toBeEnabled();
    expect(
      within(toolbar).getByRole('button', {
        name: CHART_TOOLBAR_BUTTON_LABELS.now,
      })
    ).toBeDisabled();
  });

  it('disables the now control while the chart follows live time', async () => {
    setup();

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });

    expect(
      screen.getByRole('button', { name: CHART_TOOLBAR_BUTTON_LABELS.now })
    ).toBeDisabled();
  });

  it('zooms in when the zoom in control is clicked', async () => {
    const { user } = setup();

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });

    const toolbar = screen.getByRole('toolbar', {
      name: CHART_TOOLBAR_ARIA_LABEL,
    });
    const zoomInButton = within(toolbar).getByRole('button', {
      name: CHART_TOOLBAR_BUTTON_LABELS.zoomIn,
    });
    expect(screen.getAllByTestId(CHART_GLYPH_TEST_IDS.runTrigger)).toHaveLength(
      8
    );
    const getTimedOutRunX = () =>
      screen
        .getAllByTestId(CHART_GLYPH_TEST_IDS.runTrigger)
        .find(
          (marker) =>
            marker.getAttribute('aria-label') === 'Schedule run run-timed-out'
        )?.dataset.chartX;

    const initialRunX = getTimedOutRunX();

    await user.click(zoomInButton);

    expect(getTimedOutRunX()).not.toBe(initialRunX);
    expect(screen.getAllByTestId(CHART_GLYPH_TEST_IDS.runTrigger)).toHaveLength(
      3
    );
    expect(
      screen.getAllByTestId(CHART_GLYPH_TEST_IDS.skippedExecutionTrigger)
    ).not.toHaveLength(0);
    expect(
      screen.getByTestId(CHART_SERIES_TEST_IDS.nextExecutionMarker)
    ).toBeInTheDocument();
    expect(
      within(toolbar).getByRole('button', {
        name: CHART_TOOLBAR_BUTTON_LABELS.zoomOut,
      })
    ).toBeEnabled();
  });
});

function setup({
  latestPages = [getMockWorkflowPagesForChart()[0]],
  describeScheduleResponse = getMockDescribeScheduleResponseForChart(),
  describeScheduleResponses = [describeScheduleResponse],
}: {
  latestPages?: Array<ListWorkflowsResponse>;
  describeScheduleResponse?: DescribeScheduleResponse;
  describeScheduleResponses?: DescribeScheduleResponse[];
} = {}) {
  const user = userEvent.setup({
    advanceTimers: jest.advanceTimersByTime,
  });
  let latestWorkflowRequestCount = 0;
  let describeScheduleRequestCount = 0;

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
          mockOnce: false,
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
          mockOnce: false,
          httpResolver: async () => {
            const response =
              describeScheduleResponses[describeScheduleRequestCount] ??
              describeScheduleResponses[describeScheduleResponses.length - 1];
            describeScheduleRequestCount += 1;
            return HttpResponse.json(response);
          },
        },
        {
          path: `/api/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}/workflows`,
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            if (new URL(request.url).searchParams.has('nextPage')) {
              return HttpResponse.json({ workflows: [], nextPage: '' });
            }

            const page =
              latestPages[latestWorkflowRequestCount] ??
              latestPages[latestPages.length - 1];
            latestWorkflowRequestCount += 1;
            return HttpResponse.json(page);
          },
        },
      ],
    }
  );

  return {
    user,
    getLatestWorkflowRequestCount: () => latestWorkflowRequestCount,
  };
}
