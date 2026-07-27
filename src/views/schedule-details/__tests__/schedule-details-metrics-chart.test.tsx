import React from 'react';

import { HttpResponse } from 'msw';

import {
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from '@/test-utils/rtl';

import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';

import {
  CHART_REGION_ARIA_LABEL,
  CHART_TOOLBAR_ARIA_LABEL,
  CHART_TOOLBAR_BUTTON_LABELS,
} from '../../schedule-page/schedule-detail-metrics-chart/schedule-detail-metrics-chart.constants';
import { mockScheduleDetailsSectionsConfig } from '../__fixtures__/schedule-details-sections-config';
import ScheduleDetails from '../schedule-details';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock(
  '../config/schedule-details-sections.config',
  () => mockScheduleDetailsSectionsConfig
);

jest.mock('@visx/responsive', () => ({
  useParentSize: () => ({
    parentRef: { current: null },
    width: 800,
    height: 82,
  }),
}));

describe(`${ScheduleDetails.name} metrics chart`, () => {
  it('renders a full-width chart before the details columns', async () => {
    setup();

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'));

    const chartRegion = screen.getByRole('region', {
      name: CHART_REGION_ARIA_LABEL,
    });
    expect(chartRegion).toBeInTheDocument();
    expect(
      chartRegion.compareDocumentPosition(
        screen.getByRole('button', { name: /mock policies section/i })
      )
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

    const toolbar = screen.getByRole('toolbar', {
      name: CHART_TOOLBAR_ARIA_LABEL,
    });

    Object.values(CHART_TOOLBAR_BUTTON_LABELS).forEach((label) => {
      expect(
        within(toolbar).getByRole('button', { name: label })
      ).toBeVisible();
    });
  });
});

function setup() {
  render(
    <ScheduleDetails
      params={{
        domain: 'test-domain',
        cluster: 'test-cluster',
        scheduleId: 'my-schedule',
        scheduleTab: 'details',
      }}
    />,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/schedules/:scheduleId',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: () =>
            HttpResponse.json(getMockRunningDescribeScheduleResponse()),
        },
        {
          path: '/api/domains/:domain/:cluster/workflows',
          httpMethod: 'GET',
          httpResolver: () =>
            HttpResponse.json({ workflows: [], nextPage: '' }),
        },
        {
          path: '/api/domains/:domain/:cluster',
          httpMethod: 'GET',
          httpResolver: () => HttpResponse.json({}),
        },
      ],
    }
  );
}
