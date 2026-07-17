import { QueryClient } from '@tanstack/react-query';
import { DURATION } from 'baseui/snackbar';
import { HttpResponse } from 'msw';

import { act, renderHook, waitFor } from '@/test-utils/rtl';

import { BATCH_ACTION_LIST_INVALIDATE_TIMEOUT_MS } from '../../domain-batch-actions.constants';
import { overrides } from '../../domain-batch-actions.styles';
import useTerminateBatchAction from '../use-terminate-batch-action';

const mockEnqueue = jest.fn();
const mockDequeue = jest.fn();
jest.mock('baseui/snackbar', () => ({
  ...jest.requireActual('baseui/snackbar'),
  useSnackbar: () => ({
    enqueue: mockEnqueue,
    dequeue: mockDequeue,
  }),
}));

const invalidateQueriesSpy = jest.spyOn(
  QueryClient.prototype,
  'invalidateQueries'
);

describe(useTerminateBatchAction.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('terminates the batcher workflow', async () => {
    const onSuccess = jest.fn();
    const { result, getLatestRequest } = setup({ onSuccess });

    act(() => {
      result.current.terminate('run-1');
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });

    const req = getLatestRequest();
    expect(req.url).toBe(
      '/api/domains/cadence-batcher/cluster0/workflows/batch-1/run-1/terminate'
    );
  });

  it('shows a success snackbar and invalidates the list after a delay', async () => {
    jest.useFakeTimers();
    const { result } = setup({});

    act(() => {
      result.current.terminate('run-1');
    });

    await waitFor(() => {
      expect(mockEnqueue).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Batch action aborted' }),
        DURATION.short
      );
    });

    // Loading stays up and the list is not yet invalidated during the delay.
    expect(result.current.isTerminating).toBe(true);
    expect(invalidateQueriesSpy).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(BATCH_ACTION_LIST_INVALIDATE_TIMEOUT_MS);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['listBatchActions'],
    });
    await waitFor(() => {
      expect(result.current.isTerminating).toBe(false);
    });
  });

  it('shows an error snackbar on failure', async () => {
    const onSuccess = jest.fn();
    const { result } = setup({ onSuccess, error: true });

    act(() => {
      result.current.terminate('run-1');
    });

    await waitFor(() => {
      expect(mockEnqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Failed to terminate',
          overrides: overrides.errorSnackbar,
        }),
        DURATION.short
      );
    });
    expect(onSuccess).not.toHaveBeenCalled();
    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });

  it('clears the pending invalidate timer on unmount', async () => {
    jest.useFakeTimers();
    const { result, unmount } = setup({});

    act(() => {
      result.current.terminate('run-1');
    });

    await waitFor(() => {
      expect(mockEnqueue).toHaveBeenCalled();
    });

    unmount();
    act(() => {
      jest.advanceTimersByTime(BATCH_ACTION_LIST_INVALIDATE_TIMEOUT_MS);
    });

    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });
});

function setup({
  onSuccess,
  error = false,
}: {
  onSuccess?: () => void;
  error?: boolean;
}) {
  let latestRequest: { url: string; body: unknown } = { url: '', body: null };

  const utils = renderHook(
    () =>
      useTerminateBatchAction({
        cluster: 'cluster0',
        workflowId: 'batch-1',
        onSuccess,
      }),
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/terminate',
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
                { message: 'Failed to terminate' },
                { status: 500 }
              );
            }

            return HttpResponse.json({});
          },
        },
      ],
    }
  );

  return { ...utils, getLatestRequest: () => latestRequest };
}
