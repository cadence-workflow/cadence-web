import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import useStartBatchAction from '../use-start-batch-action';
import { type BuildBatchActionPayloadParams } from '../use-start-batch-action.types';

describe(useStartBatchAction.name, () => {
  it('posts to the cadence-batcher start route with the wrapped BatchParams payload', async () => {
    const { result, getLatestRequest } = setup();

    result.current.mutate({
      domain: 'cadence-samples',
      query: 'WorkflowType="foo"',
      reason: 'cleanup',
      rps: 50,
      batchType: 'terminate',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const req = getLatestRequest();
    expect(req.url).toBe(
      '/api/domains/cadence-batcher/cluster0/workflows/start'
    );
    expect(req.body).toEqual({
      workflowType: { name: 'cadence-sys-batch-workflow-v2' },
      taskList: { name: 'cadence-sys-batcher-tasklist' },
      // Single-element top-level array so the GO branch of processWorkflowInput
      // emits exactly the BatchParams JSON object.
      input: [
        {
          DomainName: 'cadence-samples',
          Query: 'WorkflowType="foo"',
          Reason: 'cleanup',
          BatchType: 'terminate',
          RPS: 50,
        },
      ],
      workerSDKLanguage: 'GO',
      executionStartToCloseTimeoutSeconds: 20 * 365 * 24 * 60 * 60,
    });
    expect(result.current.data).toEqual({
      workflowId: 'wf-1',
      runId: 'run-1',
    });
  });

  it('surfaces errors from the start route', async () => {
    const { result } = setup({ error: true });

    result.current.mutate({
      domain: 'cadence-samples',
      query: 'WorkflowType="foo"',
      reason: 'cleanup',
      rps: 50,
      batchType: 'terminate',
    } satisfies BuildBatchActionPayloadParams);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error?.message).toBe('Failed to start');
  });
});

function setup({ error = false }: { error?: boolean } = {}) {
  let latestRequest: { url: string; body: unknown } = { url: '', body: null };

  const utils = renderHook(() => useStartBatchAction({ cluster: 'cluster0' }), {
    endpointsMocks: [
      {
        path: '/api/domains/:domain/:cluster/workflows/start',
        httpMethod: 'POST',
        mockOnce: false,
        httpResolver: async ({ request }) => {
          const text = await request.text();
          latestRequest = {
            url: new URL(request.url).pathname,
            body: text ? JSON.parse(text) : null,
          };

          if (error) {
            return HttpResponse.json(
              { message: 'Failed to start' },
              { status: 500 }
            );
          }

          return HttpResponse.json({ workflowId: 'wf-1', runId: 'run-1' });
        },
      },
    ],
  });

  return { ...utils, getLatestRequest: () => latestRequest };
}
