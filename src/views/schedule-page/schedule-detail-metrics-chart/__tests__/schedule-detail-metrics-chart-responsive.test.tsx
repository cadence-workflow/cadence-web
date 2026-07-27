import React from 'react';

import { HttpResponse } from 'msw';

import { render, screen, waitFor } from '@/test-utils/rtl';

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
  CHART_GLYPH_TEST_IDS,
  CHART_LOADING_SKELETON_TEST_ID,
  CHART_SERIES_TEST_IDS,
} from '../schedule-detail-metrics-chart.constants';

const NARROW_CHART_WIDTH_PX = 320;

jest.mock('@visx/responsive', () => ({
  useParentSize: () => ({
    parentRef: { current: null },
    width: 320,
    height: 82,
  }),
}));

describe(`${ScheduleDetailMetricsChart.name} narrow viewport`, () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: SCHEDULE_METRICS_CHART_API_FIXTURE_NOW_MS });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('thins out time labels so they stay inside the chart', async () => {
    setup();

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });

    const labels = screen
      .getByTestId(CHART_SERIES_TEST_IDS.svg)
      .querySelectorAll('text');

    expect(labels).toHaveLength(3);
    labels.forEach((label) => {
      const x = Number(label.getAttribute('x'));
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(NARROW_CHART_WIDTH_PX);
    });
  });

  it('opens on a shorter window than a wide chart would use', async () => {
    setup();

    await waitFor(() => {
      expect(
        screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
      ).not.toBeInTheDocument();
    });

    // The wide-chart fixture view fits all eight loaded run markers.
    expect(
      screen.getAllByTestId(CHART_GLYPH_TEST_IDS.runTrigger).length
    ).toBeLessThan(8);
    expect(
      screen.getByTestId(CHART_SERIES_TEST_IDS.nextExecutionMarker)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(CHART_SERIES_TEST_IDS.nowMarker)
    ).toBeInTheDocument();
  });
});

function setup() {
  return render(
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
          httpResolver: async () =>
            HttpResponse.json(getMockDescribeScheduleResponseForChart()),
        },
        {
          path: `/api/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}/workflows`,
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () =>
            HttpResponse.json(getMockWorkflowPagesForChart()[0]),
        },
      ],
    }
  );
}
