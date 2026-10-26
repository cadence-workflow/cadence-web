import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';
import { startWorkflowExecutionEvent } from '@/views/workflow-history/__fixtures__/workflow-history-single-events';
import { mockDescribeWorkflowResponse } from '@/views/workflow-page/__fixtures__/describe-workflow-response';

import useWorkflowInputResult from '../use-workflow-input-result';

describe(useWorkflowInputResult.name, () => {
  it('returns the input and the result of a closed workflow', async () => {
    const { result } = setup({});

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isRunning).toBe(false);
    expect(result.current.input).toBeDefined();
    expect(result.current.result).toEqual(
      expect.objectContaining({ reason: 'test-reason' })
    );
  });

  it('returns the decoded search attributes', async () => {
    const { result } = setup({});

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(Object.keys(result.current.searchAttributes ?? {})).toEqual([
      'BinaryChecksums',
      'CadenceChangeVersion',
    ]);
  });

  it('reports a running workflow without a result', async () => {
    const { result } = setup({ isRunning: true });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isRunning).toBe(true);
    expect(result.current.result).toBeUndefined();
  });

  it('returns the error when a request fails', async () => {
    const { result } = setup({ historyError: true });

    await waitFor(() => expect(result.current.error).not.toBeNull());
  });
});

function setup({
  isRunning,
  historyError,
}: {
  isRunning?: boolean;
  historyError?: boolean;
}) {
  const describeResponse: DescribeWorkflowResponse = isRunning
    ? {
        ...mockDescribeWorkflowResponse,
        workflowExecutionInfo: {
          ...mockDescribeWorkflowResponse.workflowExecutionInfo,
          closeEvent: null,
          closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
        },
      }
    : mockDescribeWorkflowResponse;

  return renderHook(
    () =>
      useWorkflowInputResult({
        domain: 'd',
        cluster: 'c',
        workflowId: 'w',
        runId: 'r',
      }),
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/history',
          httpMethod: 'GET',
          mockOnce: false,
          ...(historyError
            ? {
                httpResolver: async () =>
                  HttpResponse.json({ message: 'fail' }, { status: 500 }),
              }
            : {
                jsonResponse: {
                  history: { events: [startWorkflowExecutionEvent] },
                  rawHistory: [],
                  nextPageToken: '',
                },
              }),
        },
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId',
          httpMethod: 'GET',
          mockOnce: false,
          jsonResponse: describeResponse,
        },
      ],
    }
  );
}
