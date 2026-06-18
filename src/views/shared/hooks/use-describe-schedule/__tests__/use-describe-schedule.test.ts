import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';

import useDescribeSchedule from '../use-describe-schedule';
import { type DescribeScheduleResponse } from '../use-describe-schedule.types';

const mockRunningDescribeScheduleResponse =
  getMockRunningDescribeScheduleResponse();
describe(useDescribeSchedule.name, () => {
  it('returns describe data for a schedule', async () => {
    const { result } = setup({
      response: mockRunningDescribeScheduleResponse,
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockRunningDescribeScheduleResponse);
    });
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
  response?: DescribeScheduleResponse;
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
            return HttpResponse.json(
              response ?? mockRunningDescribeScheduleResponse
            );
          },
        },
      ],
    }
  );
}
