import React from 'react';

import { HttpResponse, type HttpResponseResolver } from 'msw';

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
  it('shows loading first then renders details placeholder after describe succeeds', async () => {
    // Success resolver for describe request
    const { promise: resolveResponsePromise, resolve: resolveResponse } =
      getDeferredPromise();

    const describeResolver = jest.fn(async () => {
      await resolveResponsePromise;
      return HttpResponse.json(getMockRunningDescribeScheduleResponse());
    });

    setup({ describeResolver });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    // Resolve the promise to simulate the describe request succeeding
    resolveResponse();

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'));
    expect(screen.getByText('Details — coming soon')).toBeInTheDocument();
    expect(describeResolver).toHaveBeenCalledTimes(1);
  });

  it('throws into error boundary when describe fails', async () => {
    // Error resolver for describe request
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
