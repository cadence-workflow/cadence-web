import React from 'react';

import { HttpResponse, type HttpResponseResolver } from 'msw';

import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@/test-utils/rtl';

import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';

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

const scheduleId = 'my-schedule';

describe(ScheduleDetails.name, () => {
  it('shows loading first then renders configured detail sections', async () => {
    const describeResponse = getMockRunningDescribeScheduleResponse({
      policies: {
        overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
      },
    } as Partial<DescribeScheduleResponse>);
    const { promise: resolveResponsePromise, resolve: resolveResponse } =
      getDeferredPromise();

    const describeResolver = jest.fn(async () => {
      await resolveResponsePromise;
      return HttpResponse.json(describeResponse);
    });

    setup({ describeResolver });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    resolveResponse();

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'));

    expect(
      screen.getByRole('heading', { name: 'Mock policies section' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('rowheader', { name: 'Primary row' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('rowheader', { name: 'Conditional row' })
    ).toBeInTheDocument();
    expect(screen.getByText('conditional-value')).toBeInTheDocument();

    expect(describeResolver).toHaveBeenCalledTimes(1);
  });

  it('renders schedule input JSON section when workflow input is present', async () => {
    setup({
      describeResolver: () =>
        HttpResponse.json(
          getMockRunningDescribeScheduleResponse({
            action: {
              startWorkflow: {
                workflowType: { name: 'ScheduleWorker' },
                taskList: {
                  name: 'schedule-task-list',
                  kind: 'TASK_LIST_KIND_NORMAL',
                  baseName: 'schedule-task-list',
                },
                input: {
                  data: 'eyJ3b3JrZmxvd0FyZyI6InRlc3QtdmFsdWUifQ==',
                },
                workflowIdPrefix: 'schedule-prefix',
                executionStartToCloseTimeout: null,
                taskStartToCloseTimeout: null,
                retryPolicy: null,
                memo: null,
                searchAttributes: null,
              },
            },
          })
        ),
    });

    expect(await screen.findByText('Input')).toBeInTheDocument();
  });

  it('renders schedule input JSON section when workflow input is absent', async () => {
    setup({
      describeResolver: () =>
        HttpResponse.json(getMockRunningDescribeScheduleResponse()),
    });

    expect(
      await screen.findByRole('heading', { name: 'Mock policies section' })
    ).toBeInTheDocument();
    expect(screen.getByText('Input')).toBeInTheDocument();
  });

  it('hides conditional rows when hide predicate returns true', async () => {
    const describeResponse = getMockRunningDescribeScheduleResponse({
      policies: {
        overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_SKIP_NEW,
      },
    } as Partial<DescribeScheduleResponse>);

    setup({
      describeResolver: () => HttpResponse.json(describeResponse),
    });

    expect(
      await screen.findByRole('heading', { name: 'Mock policies section' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('rowheader', { name: 'Primary row' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_SKIP_NEW)
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('rowheader', { name: 'Conditional row' })
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
        scheduleId,
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

function getDeferredPromise(): {
  promise: Promise<void>;
  resolve: () => void;
} {
  let resolve = () => {};
  const promise = new Promise<void>((resolvePromise) => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
}
