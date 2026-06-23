import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen, waitFor } from '@/test-utils/rtl';

import ErrorBoundary from '@/components/error-boundary/error-boundary';
import {
  getMockPausedDescribeScheduleResponse,
  getMockRunningDescribeScheduleResponse,
} from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import { type DescribeScheduleResponse } from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule.types';

import SchedulePageHeaderStatusTag from '../schedule-page-header-status-tag';

jest.mock('@/views/shared/schedule-status-tag/schedule-status-tag', () =>
  jest.fn((props: { paused: boolean }) => (
    <div data-testid="schedule-status-tag">paused:{String(props.paused)}</div>
  ))
);

describe(SchedulePageHeaderStatusTag.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('passes paused=true to ScheduleStatusTag when schedule is paused', async () => {
    setup({ response: getMockPausedDescribeScheduleResponse() });

    expect(await screen.findByTestId('schedule-status-tag')).toHaveTextContent(
      'paused:true'
    );
  });

  it('passes paused=false to ScheduleStatusTag when schedule is running', async () => {
    setup({ response: getMockRunningDescribeScheduleResponse() });

    expect(await screen.findByTestId('schedule-status-tag')).toHaveTextContent(
      'paused:false'
    );
  });

  it('renders nothing when describe schedule fails', async () => {
    setup({ isError: true });

    await waitFor(() => {
      expect(
        screen.queryByTestId('schedule-status-tag')
      ).not.toBeInTheDocument();
    });
    expect(
      screen.queryByText('Error loading schedule status')
    ).not.toBeInTheDocument();
  });
});

function setup({
  response = getMockRunningDescribeScheduleResponse(),
  isError = false,
}: {
  response?: DescribeScheduleResponse;
  isError?: boolean;
}) {
  return render(
    <ErrorBoundary
      fallbackRender={() => <div>Error loading schedule status</div>}
      omitLogging
    >
      <Suspense fallback={null}>
        <SchedulePageHeaderStatusTag
          domain="test-domain"
          cluster="test-cluster"
          scheduleId="test-schedule"
        />
      </Suspense>
    </ErrorBoundary>,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/schedules/:scheduleId',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: () =>
            isError
              ? HttpResponse.json({ message: 'Error' }, { status: 500 })
              : HttpResponse.json(response),
        },
      ],
    }
  );
}
