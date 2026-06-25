import React from 'react';

import { HttpResponse, delay, type HttpResponseResolver } from 'msw';

import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@/test-utils/rtl';

import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';

import ScheduleDetails from '../schedule-details';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe(ScheduleDetails.name, () => {
  it('shows loading first then renders the config-driven sections container', async () => {
    const describeResolver = jest.fn(async () => {
      await delay(100);
      return HttpResponse.json(getMockRunningDescribeScheduleResponse());
    });

    setup({ describeResolver });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'));
    expect(describeResolver).toHaveBeenCalledTimes(1);
  });

  it('renders schedule specifications section rows', async () => {
    setup({
      describeResolver: () =>
        HttpResponse.json(
          getMockRunningDescribeScheduleResponse({
            info: {
              createTime: { seconds: '1745490629', nanos: 850000000 },
              nextRunTime: { seconds: '1745490629', nanos: 850000000 },
              lastRunTime: { seconds: '1745490629', nanos: 850000000 },
              totalRuns: '32',
              lastUpdateTime: null,
              ongoingBackfills: [],
              missedRuns: '0',
              skippedRuns: '0',
            },
            spec: {
              cronExpression: '0 * * * *',
              startTime: { seconds: '1735689600', nanos: 0 },
              endTime: null,
              jitter: { seconds: '300', nanos: 0 },
            },
          })
        ),
    });

    expect(
      await screen.findByRole('heading', { name: 'Schedule specifications' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Schedule action' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Schedule policies' })
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('rowheader', { name: 'Schedule Id' })
    ).toBeInTheDocument();
    expect(screen.getByText('my-schedule')).toBeInTheDocument();
    expect(
      screen.getByRole('rowheader', { name: 'Cron execution' })
    ).toBeInTheDocument();
    expect(screen.getByText('Every hour (0 * * * *)')).toBeInTheDocument();
    expect(screen.getByText('5m')).toBeInTheDocument();
  });

  it('hides optional specification rows when schedule fields are missing', async () => {
    setup({
      describeResolver: () =>
        HttpResponse.json(
          getMockRunningDescribeScheduleResponse({
            spec: {
              cronExpression: '*/10 * * * *',
              startTime: null,
              endTime: null,
              jitter: null,
            },
          })
        ),
    });

    expect(
      await screen.findByRole('heading', { name: 'Schedule specifications' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('rowheader', { name: 'Start time' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('rowheader', { name: 'Creation time' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('rowheader', { name: 'Jitter duration' })
    ).not.toBeInTheDocument();
  });

  it('throws into error boundary when describe fails', async () => {
    const describeResolver = jest.fn(() =>
      HttpResponse.json(
        { message: 'Failed to describe schedule' },
        { status: 500 }
      )
    );

    try {
      await act(async () => {
        setup({ describeResolver });
      });
    } catch (error) {
      expect((error as Error).message).toBe('Failed to describe schedule');
    }

    expect(describeResolver).toHaveBeenCalledTimes(1);
  });
});

function setup({
  describeResolver,
}: {
  describeResolver: HttpResponseResolver;
}) {
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
          httpResolver: describeResolver,
        },
      ],
    }
  );
}
