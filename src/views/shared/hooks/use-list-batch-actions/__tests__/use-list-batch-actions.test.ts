import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import { type ListBatchActionsResponse } from '@/route-handlers/list-batch-actions/list-batch-actions.types';

import useListBatchActions from '../use-list-batch-actions';

const mockResponse: ListBatchActionsResponse = {
  batchActions: [
    {
      workflowId: 'wf-1',
      runId: 'batch-1',
      status: 'RUNNING',
      startTime: 1717400000000,
    },
    {
      workflowId: 'wf-2',
      runId: 'batch-2',
      status: 'COMPLETED',
      startTime: 1717400000000,
    },
  ],
  nextPageToken: '',
};

describe(useListBatchActions.name, () => {
  it('fetches the first page from the batch-actions endpoint and forwards pageSize', async () => {
    const { result, getLatestRequest } = setup();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const req = getLatestRequest();
    expect(req.url).toBe('/api/domains/cadence-samples/cluster0/batch-actions');
    expect(req.search).toEqual({ pageSize: '25' });

    expect(result.current.data?.pages[0]).toEqual(mockResponse);
  });

  it('surfaces errors from the batch-actions endpoint', async () => {
    const { result } = setup({ error: true });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error?.message).toBe('Failed to fetch batch actions');
  });
});

function setup({ error = false }: { error?: boolean } = {}) {
  let latestRequest: { url: string; search: Record<string, string> } = {
    url: '',
    search: {},
  };

  const utils = renderHook(
    () =>
      useListBatchActions({
        domain: 'cadence-samples',
        cluster: 'cluster0',
        pageSize: 25,
      }),
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/batch-actions',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            const url = new URL(request.url);
            latestRequest = {
              url: url.pathname,
              search: Object.fromEntries(url.searchParams.entries()),
            };

            if (error) {
              return HttpResponse.json(
                { message: 'Failed to fetch batch actions' },
                { status: 500 }
              );
            }

            return HttpResponse.json(mockResponse);
          },
        },
      ],
    }
  );

  return { ...utils, getLatestRequest: () => latestRequest };
}
