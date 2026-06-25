import React from 'react';

import { HttpResponse, delay, type HttpResponseResolver } from 'msw';

import {
  act,
  render,
  screen,
  userEvent,
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
  it('shows loading first then renders detail sections with representative values', async () => {
    const user = userEvent.setup();
    const describeResolver = jest.fn(async () => {
      await delay(100);
      return HttpResponse.json(
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
          policies: {
            overlapPolicy: 'SCHEDULE_OVERLAP_POLICY_BUFFER',
            catchUpPolicy: 'SCHEDULE_CATCH_UP_POLICY_ONE',
            catchUpWindow: { seconds: '3600', nanos: 0 },
            pauseOnFailure: true,
            bufferLimit: 10,
            concurrencyLimit: 2,
          },
          action: {
            startWorkflow: {
              workflowType: { name: 'ScheduleWorker' },
              taskList: {
                name: 'schedule-task-list',
                kind: 'TASK_LIST_KIND_NORMAL',
                baseName: 'schedule-task-list',
              },
              input: null,
              workflowIdPrefix: 'schedule-prefix',
              executionStartToCloseTimeout: { seconds: '1800', nanos: 0 },
              taskStartToCloseTimeout: null,
              retryPolicy: null,
              memo: null,
              searchAttributes: null,
            },
          },
        })
      );
    });

    setup({ describeResolver });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'));
    expect(
      screen.getByRole('heading', { name: 'Schedule specifications' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Schedule action' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Schedule policies' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('rowheader', { name: 'Schedule Id' })
    ).toBeInTheDocument();
    expect(screen.getByText('my-schedule')).toBeInTheDocument();
    expect(
      screen.getByRole('rowheader', { name: 'Cron execution' })
    ).toBeInTheDocument();
    expect(screen.getByText('Every hour (0 * * * *)')).toBeInTheDocument();
    expect(screen.getByText('5m')).toBeInTheDocument();
    expect(screen.getByText('Buffer')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('ScheduleWorker')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Collapse Schedule action details' })
    );
    expect(
      screen.queryByRole('rowheader', { name: 'Workflow type' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Expand Schedule action details' })
    ).toBeInTheDocument();

    expect(describeResolver).toHaveBeenCalledTimes(1);
  });

  it('hides optional detail rows when schedule fields are missing', async () => {
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
            policies: {
              overlapPolicy: 'SCHEDULE_OVERLAP_POLICY_INVALID',
              catchUpPolicy: 'SCHEDULE_CATCH_UP_POLICY_INVALID',
              catchUpWindow: null,
              pauseOnFailure: false,
              bufferLimit: 0,
              concurrencyLimit: 0,
            },
            action: { startWorkflow: null },
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
    expect(
      screen.queryByRole('rowheader', { name: 'Workflow Id Prefix' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('rowheader', { name: 'Schedule Search attributes' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('rowheader', { name: 'Overlap policy' })
    ).toBeInTheDocument();
    expect(screen.getByText('Default (SkipNew)')).toBeInTheDocument();
    expect(screen.getByText('Default (Skip)')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Schedule action' })
    ).toBeInTheDocument();
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
