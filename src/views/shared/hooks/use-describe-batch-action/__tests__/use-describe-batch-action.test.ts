import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import { type BatchAction } from '@/views/domain-batch-actions/domain-batch-actions.types';

import useDescribeBatchAction from '../use-describe-batch-action';

const mockResponse: BatchAction = {
  id: 'batch-1',
  status: 'COMPLETED',
  startTime: 1717408148258,
  endTime: 1717409148258,
};

describe(useDescribeBatchAction.name, () => {
  it('fetches a batch action from the describe endpoint using the batchActionId from params', async () => {
    const { result, getLatestRequest } = setup();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getLatestRequest().url).toBe(
      '/api/domains/cadence-samples/cluster0/batch-actions/batch-1'
    );
    expect(result.current.data).toEqual(mockResponse);
  });

  it('encodes domain, cluster, and batchActionId in the URL', async () => {
    const { result, getLatestRequest } = setup({
      domain: 'evil/domain',
      cluster: 'cluster 0',
      batchActionId: 'id with/slash',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getLatestRequest().url).toBe(
      '/api/domains/evil%2Fdomain/cluster%200/batch-actions/id%20with%2Fslash'
    );
  });

  it('surfaces errors from the describe endpoint', async () => {
    const { result } = setup({ error: true });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error?.message).toBe('Batch action not found');
  });
});

function setup({
  error = false,
  domain = 'cadence-samples',
  cluster = 'cluster0',
  batchActionId = 'batch-1',
}: {
  error?: boolean;
  domain?: string;
  cluster?: string;
  batchActionId?: string;
} = {}) {
  let latestRequest: { url: string } = { url: '' };

  const utils = renderHook(
    () =>
      useDescribeBatchAction({
        domain,
        cluster,
        batchActionId,
      }),
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/batch-actions/:batchActionId',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            latestRequest = { url: new URL(request.url).pathname };

            if (error) {
              return HttpResponse.json(
                { message: 'Batch action not found' },
                { status: 404 }
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
