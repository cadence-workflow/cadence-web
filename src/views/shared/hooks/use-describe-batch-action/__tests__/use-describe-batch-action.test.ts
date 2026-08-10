import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import { type BatchAction } from '@/views/domain-batch-actions/domain-batch-actions.types';

import useDescribeBatchAction from '../use-describe-batch-action';

const mockResponse: BatchAction = {
  runId: 'batch-1',
  status: 'COMPLETED',
  startTime: 1717408148258,
  endTime: 1717409148258,
};

describe(useDescribeBatchAction.name, () => {
  it('fetches a batch action addressing the execution by the compound workflowId/runId path', async () => {
    const { result, getLatestRequest } = setup();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getLatestRequest().pathname).toBe(
      '/api/domains/cadence-samples/cluster0/batch-actions/wf-1/batch-1'
    );
    expect(result.current.data).toEqual(mockResponse);
  });

  it('encodes domain, cluster, workflowId, and runId in the URL', async () => {
    const { result, getLatestRequest } = setup({
      domain: 'evil/domain',
      cluster: 'cluster 0',
      workflowId: 'wf with/slash',
      runId: 'run with/slash',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getLatestRequest().pathname).toBe(
      '/api/domains/evil%2Fdomain/cluster%200/batch-actions/wf%20with%2Fslash/run%20with%2Fslash'
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
  workflowId = 'wf-1',
  runId = 'batch-1',
}: {
  error?: boolean;
  domain?: string;
  cluster?: string;
  workflowId?: string;
  runId?: string;
} = {}) {
  let latestRequest: { pathname: string } = { pathname: '' };

  const utils = renderHook(
    () =>
      useDescribeBatchAction({
        domain,
        cluster,
        workflowId,
        runId,
      }),
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/batch-actions/:workflowId/:runId',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            latestRequest = { pathname: new URL(request.url).pathname };

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
