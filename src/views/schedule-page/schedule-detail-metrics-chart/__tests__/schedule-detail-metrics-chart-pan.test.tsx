import React from 'react';

import { act } from '@testing-library/react';
import { HttpResponse } from 'msw';

import { fireEvent, render, screen, waitFor } from '@/test-utils/rtl';

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
  CHART_LOADING_SKELETON_TEST_ID,
  CHART_SERIES_TEST_IDS,
  CHART_TOOLBAR_BUTTON_LABELS,
} from '../schedule-detail-metrics-chart.constants';

jest.mock('@visx/responsive', () => ({
  useParentSize: () => ({
    parentRef: { current: null },
    width: 800,
    height: 82,
  }),
}));

describe(`${ScheduleDetailMetricsChart.name} panning`, () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: SCHEDULE_METRICS_CHART_API_FIXTURE_NOW_MS });
    HTMLElement.prototype.setPointerCapture = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('pans into history on drag and stops following live time', async () => {
    const { getTimeLabels, getCanvas } = await setup();
    const initialLabels = getTimeLabels();

    dragBy(getCanvas(), 240);

    expect(getTimeLabels()).not.toEqual(initialLabels);
    expect(
      screen.getByRole('button', { name: CHART_TOOLBAR_BUTTON_LABELS.now })
    ).toBeEnabled();
  });

  it('holds still when dragging past the future boundary', async () => {
    const { getTimeLabels, getCanvas } = await setup();
    const initialLabels = getTimeLabels();

    dragBy(getCanvas(), -240);

    expect(getTimeLabels()).toEqual(initialLabels);
    expect(
      screen.getByRole('button', { name: CHART_TOOLBAR_BUTTON_LABELS.now })
    ).toBeDisabled();
  });

  it('leaves wheel gestures to the page once the chart cannot move', async () => {
    const { getCanvas } = await setup();

    expect(dispatchWheel(getCanvas(), 200).defaultPrevented).toBe(false);
    expect(dispatchWheel(getCanvas(), -200).defaultPrevented).toBe(true);
  });
});

function dragBy(canvas: HTMLElement, deltaClientX: number) {
  const startClientX = 400;

  fireEvent(
    canvas,
    new MouseEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: 0,
      clientX: startClientX,
    })
  );
  fireEvent(
    window,
    new MouseEvent('pointermove', {
      bubbles: true,
      clientX: startClientX + deltaClientX,
    })
  );
  fireEvent(window, new MouseEvent('pointerup', { bubbles: true }));
}

function dispatchWheel(canvas: HTMLElement, deltaY: number) {
  const event = new WheelEvent('wheel', {
    bubbles: true,
    cancelable: true,
    deltaY,
  });

  act(() => {
    canvas.dispatchEvent(event);
  });

  return event;
}

async function setup() {
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

  await waitFor(() => {
    expect(
      screen.queryByTestId(CHART_LOADING_SKELETON_TEST_ID)
    ).not.toBeInTheDocument();
  });

  return {
    getCanvas: () => screen.getByTestId(CHART_CANVAS_TEST_ID),
    getTimeLabels: () =>
      Array.from(
        screen.getByTestId(CHART_SERIES_TEST_IDS.svg).querySelectorAll('text')
      ).map((label) => label.textContent),
  };
}
