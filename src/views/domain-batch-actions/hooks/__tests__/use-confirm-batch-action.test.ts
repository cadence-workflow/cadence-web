import { DURATION } from 'baseui/snackbar';
import { HttpResponse } from 'msw';

import { act, renderHook, waitFor } from '@/test-utils/rtl';

import { overrides } from '../../domain-batch-actions.styles';
import useConfirmBatchAction from '../use-confirm-batch-action';

const mockEnqueue = jest.fn();
const mockDequeue = jest.fn();
jest.mock('baseui/snackbar', () => ({
  ...jest.requireActual('baseui/snackbar'),
  useSnackbar: () => ({
    enqueue: mockEnqueue,
    dequeue: mockDequeue,
  }),
}));

const mockRouterPush = jest.fn();
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

describe(useConfirmBatchAction.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('starts the batch action, calls onSuccess, redirects, and shows a success snackbar', async () => {
    const onSuccess = jest.fn();
    const { result } = setup({ onSuccess });

    act(() => {
      result.current.handleConfirm({
        batchType: 'terminate',
        query: 'WorkflowType="foo"',
        reason: 'cleanup',
        rps: 10,
      });
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
    expect(mockRouterPush).toHaveBeenCalledWith(
      '/domains/cadence-samples/cluster0/batch-actions?baid=run-1&bawid=wf-1'
    );
    expect(mockEnqueue).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Batch action started',
      }),
      DURATION.short
    );
  });

  it('shows an error snackbar and does not call onSuccess on failure', async () => {
    const onSuccess = jest.fn();
    const { result } = setup({ onSuccess, error: true });

    act(() => {
      result.current.handleConfirm({
        batchType: 'terminate',
        query: 'WorkflowType="foo"',
        reason: 'cleanup',
        rps: 10,
      });
    });

    await waitFor(() => {
      expect(mockEnqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Failed to start',
          overrides: overrides.errorSnackbar,
        }),
        DURATION.short
      );
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });
});

function setup({
  onSuccess,
  error = false,
}: {
  onSuccess?: () => void;
  error?: boolean;
}) {
  return renderHook(
    () =>
      useConfirmBatchAction({
        domain: 'cadence-samples',
        cluster: 'cluster0',
        onSuccess,
      }),
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows/start',
          httpMethod: 'POST',
          mockOnce: false,
          httpResolver: async () => {
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
    }
  );
}
