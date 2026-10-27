import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import {
  WORKFLOW_HOME_QUERY_MAX_RETRIES,
  WORKFLOW_HOME_QUERY_NAME,
} from '../../workflow-home.constants';
import useWorkflowHomeQuery from '../use-workflow-home-query';

jest.mock('../../workflow-home.constants', () => ({
  ...jest.requireActual('../../workflow-home.constants'),
  WORKFLOW_HOME_QUERY_RETRY_DELAY_MS: 0,
}));

const params = { domain: 'd', cluster: 'c', workflowId: 'w', runId: 'r' };

describe(useWorkflowHomeQuery.name, () => {
  it('posts the home page query and returns the result', async () => {
    const { result, getCalls } = setup({ enabled: true });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.result).toEqual({ a: 1 });
    expect(getCalls()).toBe(1);
  });

  it('does not call the worker when disabled', async () => {
    const { getCalls } = setup({ enabled: false });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(getCalls()).toBe(0);
  });

  it('retries a failed query', async () => {
    const { result, getCalls } = setup({ enabled: true, error: 'other' });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(getCalls()).toBe(WORKFLOW_HOME_QUERY_MAX_RETRIES + 1);
  });

  it('does not retry when the worker has no handler for the query', async () => {
    const { result, getCalls } = setup({
      enabled: true,
      error: 'missing-handler',
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(getCalls()).toBe(1);
  });

  it('polls when a refetch interval is set', async () => {
    const { getCalls } = setup({ enabled: true, refetchInterval: 50 });
    await waitFor(() => expect(getCalls()).toBeGreaterThan(2));
  });

  it('stops polling when the worker has no handler for the query', async () => {
    const { result, getCalls } = setup({
      enabled: true,
      refetchInterval: 50,
      error: 'missing-handler',
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(getCalls()).toBe(1);
  });
});

function setup({
  enabled,
  refetchInterval,
  error,
}: {
  enabled: boolean;
  refetchInterval?: number;
  error?: 'other' | 'missing-handler';
}) {
  let calls = 0;
  const { result } = renderHook(
    () => useWorkflowHomeQuery(params, { enabled, refetchInterval }),
    {
      endpointsMocks: [
        {
          path: `/api/domains/:domain/:cluster/workflows/:workflowId/:runId/query/${WORKFLOW_HOME_QUERY_NAME}`,
          httpMethod: 'POST',
          mockOnce: false,
          httpResolver: async () => {
            calls++;
            if (error === 'missing-handler') {
              return HttpResponse.json(
                {
                  message:
                    'unknown queryType home. KnownQueryTypes=[__stack_trace]',
                },
                { status: 500 }
              );
            }
            return error
              ? HttpResponse.json({ message: 'nope' }, { status: 500 })
              : HttpResponse.json({ result: { a: 1 }, rejected: null });
          },
        },
      ],
    }
  );
  return { result, getCalls: () => calls };
}
