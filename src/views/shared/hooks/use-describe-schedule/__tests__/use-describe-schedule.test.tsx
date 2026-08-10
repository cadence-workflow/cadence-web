import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import {
  getMockPausedDescribeScheduleResponse,
  getMockRunningDescribeScheduleResponse,
} from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';

import useDescribeSchedule from '../use-describe-schedule';

const params = {
  domain: 'test-domain',
  cluster: 'test-cluster',
  scheduleId: 'test-schedule-id',
};

describe(useDescribeSchedule.name, () => {
  it('refetches when remounting after navigating away from a schedule', async () => {
    let response = getMockRunningDescribeScheduleResponse();
    const describeResolver = jest.fn(async () => HttpResponse.json(response));

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: Infinity,
          refetchOnWindowFocus: false,
        },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const endpointsMocks = [
      {
        path: '/api/domains/:domain/:cluster/schedules/:scheduleId',
        httpMethod: 'GET' as const,
        mockOnce: false,
        httpResolver: describeResolver,
      },
    ];

    const { result, unmount } = renderHook(
      () => useDescribeSchedule(params),
      { endpointsMocks },
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.state?.paused).toBe(false);
    expect(describeResolver).toHaveBeenCalledTimes(1);

    unmount();

    response = getMockPausedDescribeScheduleResponse();

    const { result: remountedResult } = renderHook(
      () => useDescribeSchedule(params),
      { endpointsMocks },
      { wrapper }
    );

    expect(remountedResult.current.data?.state?.paused).toBe(false);

    await waitFor(() => {
      expect(remountedResult.current.data?.state?.paused).toBe(true);
    });

    expect(describeResolver).toHaveBeenCalledTimes(2);
  });
});
