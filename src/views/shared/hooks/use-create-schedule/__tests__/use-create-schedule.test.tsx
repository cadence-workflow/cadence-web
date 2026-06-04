import { QueryClient } from '@tanstack/react-query';
import { act } from '@testing-library/react';
import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import { mockCreateScheduleRequestBody } from '@/route-handlers/create-schedule/__fixtures__/create-schedule-request-body';

import useCreateSchedule from '../use-create-schedule';

const MOCK_DOMAIN = 'test-domain';
const MOCK_CLUSTER = 'test-cluster';

describe(useCreateSchedule.name, () => {
  it('sends a POST request to the correct schedules endpoint with the mutation variables', async () => {
    const { result, getLatestRequest } = setup({});

    await act(async () => {
      await result.current.mutateAsync(mockCreateScheduleRequestBody);
    });

    const req = getLatestRequest();
    expect(req.url).toBe(
      `/api/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}/schedules`
    );
    expect(req.method).toBe('POST');
    expect(req.body).toEqual(mockCreateScheduleRequestBody);
  });

  it('invalidates listSchedules queries on success', async () => {
    const invalidateQueriesSpy = jest.spyOn(
      QueryClient.prototype,
      'invalidateQueries'
    );

    const { result } = setup({});

    await act(async () => {
      await result.current.mutateAsync(mockCreateScheduleRequestBody);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [
          'listSchedules',
          { domain: MOCK_DOMAIN, cluster: MOCK_CLUSTER },
        ],
      })
    );
  });

  it('does not invalidate queries on failure', async () => {
    const invalidateQueriesSpy = jest.spyOn(
      QueryClient.prototype,
      'invalidateQueries'
    );

    const { result } = setup({
      httpResolver: async () =>
        HttpResponse.json(
          { message: 'Schedule already exists' },
          { status: 409 }
        ),
    });

    await act(async () => {
      try {
        await result.current.mutateAsync(mockCreateScheduleRequestBody);
      } catch {
        // expected to throw
      }
    });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });
});

function setup({
  httpResolver,
}: {
  httpResolver?: (args: {
    request: Request;
  }) =>
    | ReturnType<typeof HttpResponse.json>
    | Promise<ReturnType<typeof HttpResponse.json>>;
} = {}) {
  let latestRequest: { url: string; method: string; body: unknown } = {
    url: '',
    method: '',
    body: null,
  };

  const utils = renderHook(
    () => useCreateSchedule({ domain: MOCK_DOMAIN, cluster: MOCK_CLUSTER }),
    {
      endpointsMocks: [
        {
          path: `/api/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}/schedules`,
          httpMethod: 'POST',
          mockOnce: false,
          httpResolver:
            httpResolver ??
            (async ({ request }) => {
              const url = new URL(request.url);
              latestRequest = {
                url: url.pathname,
                method: request.method,
                body: await request.json(),
              };
              return HttpResponse.json({});
            }),
        },
      ],
    }
  );

  return { ...utils, getLatestRequest: () => latestRequest };
}
