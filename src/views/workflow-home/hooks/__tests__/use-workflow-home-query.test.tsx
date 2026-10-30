import { HttpResponse } from 'msw';

import { act, renderHook, waitFor } from '@/test-utils/rtl';

import {
  WORKFLOW_HOME_QUERY_MAX_RETRIES,
  WORKFLOW_HOME_QUERY_NAME,
  WORKFLOW_HOME_QUERY_RETRY_DELAY_MS,
} from '../../workflow-home.constants';
import useWorkflowHomeQuery from '../use-workflow-home-query';

const params = { domain: 'd', cluster: 'c', workflowId: 'w', runId: 'r' };

describe(useWorkflowHomeQuery.name, () => {
  afterEach(() => jest.useRealTimers());

  it('posts the home page query and returns the result', async () => {
    const { result, getCalls } = setup({ enabled: true });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.result).toEqual({ a: 1 });
    expect(getCalls()).toBe(1);
  });

  it('does not call the worker when disabled', async () => {
    jest.useFakeTimers();
    const { getCalls } = setup({ enabled: false });
    await act(() => jest.advanceTimersByTimeAsync(100));
    expect(getCalls()).toBe(0);
  });

  it('retries a failed query', async () => {
    jest.useFakeTimers();
    const { result, getCalls } = setup({ enabled: true, error: 'other' });
    await act(() =>
      jest.advanceTimersByTimeAsync(
        WORKFLOW_HOME_QUERY_RETRY_DELAY_MS * WORKFLOW_HOME_QUERY_MAX_RETRIES
      )
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(getCalls()).toBe(WORKFLOW_HOME_QUERY_MAX_RETRIES + 1);
  });

  it('does not retry when the worker has no handler for the query', async () => {
    jest.useFakeTimers();
    const { result, getCalls } = setup({
      enabled: true,
      error: 'missing-handler',
    });
    await act(() =>
      jest.advanceTimersByTimeAsync(
        WORKFLOW_HOME_QUERY_RETRY_DELAY_MS * WORKFLOW_HOME_QUERY_MAX_RETRIES
      )
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(getCalls()).toBe(1);
  });
});

function setup({
  enabled,
  error,
}: {
  enabled: boolean;
  error?: 'other' | 'missing-handler';
}) {
  let calls = 0;
  const { result } = renderHook(
    () => useWorkflowHomeQuery(params, { enabled }),
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
