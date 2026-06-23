import React from 'react';

import { HttpResponse } from 'msw';

import { render, screen, userEvent, within, waitFor } from '@/test-utils/rtl';

import {
  getMockDescribeScheduleResponseForChart,
  getMockWorkflowPagesForChart,
  MOCK_CLUSTER,
  MOCK_DOMAIN,
  MOCK_SCHEDULE_ID,
  SCHEDULE_METRICS_CHART_API_FIXTURE_NOW_MS,
} from '../__fixtures__/schedule-detail-metrics-chart-api-fixture';
import {
  CHART_LOADING_SKELETON_TEST_ID,
  CHART_REGION_ARIA_LABEL,
  CHART_SERIES_TEST_IDS,
  CHART_TOOLBAR_ARIA_LABEL,
  CHART_TOOLBAR_BUTTON_LABELS,
} from '../schedule-detail-metrics-chart.constants';
import ScheduleDetailMetricsChart from '../schedule-detail-metrics-chart';

jest.mock('@visx/responsive', () => ({
  ParentSize: ({
    children,
  }: {
    children: (args: { width: number; height: number }) => React.ReactNode;
  }) => <>{children({ width: 800, height: 280 })}</>,
}));

describe(ScheduleDetailMetricsChart.name, () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: SCHEDULE_METRICS_CHART_API_FIXTURE_NOW_MS });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders chart canvas with live workflow markers', async () => {
    setup();

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
    expect(
      screen.getByTestId(CHART_SERIES_TEST_IDS.svg)
    ).toBeInTheDocument();
    expect(
      screen.getAllByTestId(CHART_SERIES_TEST_IDS.successfulRunMarker)
    ).toHaveLength(2);
    expect(
      screen.getByTestId(CHART_SERIES_TEST_IDS.nextExecutionMarker)
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
    ).not.toBeInTheDocument();
  });

  it('renders enabled chart toolbar controls when chart has data', async () => {
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
    ).toBeDisabled();
    expect(
      within(toolbar).getByRole('button', {
        name: CHART_TOOLBAR_BUTTON_LABELS.fitAll,
      })
    ).toBeDisabled();
    expect(
      within(toolbar).getByRole('button', {
        name: CHART_TOOLBAR_BUTTON_LABELS.now,
      })
    ).toBeEnabled();
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
    const getLastSuccessfulRunX = () =>
      screen
        .getAllByTestId(CHART_SERIES_TEST_IDS.successfulRunMarker)
        .at(-1)
        ?.getAttribute('cx');

    const initialSuccessfulRunX = getLastSuccessfulRunX();

    await user.click(zoomInButton);

    expect(getLastSuccessfulRunX()).not.toBe(initialSuccessfulRunX);
    expect(
      within(toolbar).getByRole('button', {
        name: CHART_TOOLBAR_BUTTON_LABELS.zoomOut,
      })
    ).toBeEnabled();
    expect(
      within(toolbar).getByRole('button', {
        name: CHART_TOOLBAR_BUTTON_LABELS.fitAll,
      })
    ).toBeEnabled();
  });
});

function setup() {
  const user = userEvent.setup({
    advanceTimers: jest.advanceTimersByTime,
  });

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
          httpResolver: async () =>
            HttpResponse.json(getMockWorkflowPagesForChart()[0]),
        },
      ],
    }
  );

  return { user };
}
