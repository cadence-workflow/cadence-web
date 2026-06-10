import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';
import {
  mockRunningDescribeScheduleResponse,
  mockPausedDescribeScheduleResponse,
} from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';

import useDescribeSchedule from '../use-describe-schedule';

describe(useDescribeSchedule.name, () => {
  it('returns describe data for a running schedule', async () => {
    const { result } = setup({
      response: mockRunningDescribeScheduleResponse,
    });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data?.state.paused).toBe(false);
    expect(result.current.data?.info.nextRunTime).toBeTruthy();
  });

  it('returns describe data for a paused schedule', async () => {
    const { result } = setup({
      response: mockPausedDescribeScheduleResponse,
    });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data?.state.paused).toBe(true);
    expect(result.current.data?.state.pauseInfo?.pausedBy).toBe(
      'operator@example.com'
    );
    expect(result.current.data?.state.pauseInfo?.reason).toBe(
      'Paused for maintenance'
    );
  });

  it('surfaces error when API fails', async () => {
    const { result } = setup({ error: true });

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });

  it('exposes isLoading during initial fetch', () => {
    const { result } = setup({
      response: mockRunningDescribeScheduleResponse,
    });

    expect(result.current.isLoading).toBe(true);
  });
});

function setup({
  response,
  error = false,
}: {
  response?: typeof mockRunningDescribeScheduleResponse;
  error?: boolean;
} = {}) {
  return renderHook(
    () =>
      useDescribeSchedule({
        domain: 'test-domain',
        cluster: 'test-cluster',
        scheduleId: 'test-schedule-id',
      }),
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/schedules/:scheduleId',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            if (error) {
              return HttpResponse.json(
                { message: 'Failed to describe schedule' },
                { status: 500 }
              );
            }
            return HttpResponse.json(response ?? mockRunningDescribeScheduleResponse);
          },
        },
      ],
    }
  );
}
