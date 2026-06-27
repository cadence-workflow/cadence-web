import { DURATION } from 'baseui/snackbar';
import { HttpResponse } from 'msw';

import { act, renderHook, waitFor } from '@/test-utils/rtl';

import { overrides } from '../../domain-batch-actions.styles';
import useEditBatchActionRps from '../use-edit-batch-action-rps';

const mockEnqueue = jest.fn();
const mockDequeue = jest.fn();
jest.mock('baseui/snackbar', () => ({
  ...jest.requireActual('baseui/snackbar'),
  useSnackbar: () => ({
    enqueue: mockEnqueue,
    dequeue: mockDequeue,
  }),
}));

const mockInvalidateQueries = jest.fn();
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

describe(useEditBatchActionRps.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('signals the batcher workflow with the RPS payload', async () => {
    const onSuccess = jest.fn();
    const { result, getLatestRequest } = setup({ onSuccess });

    act(() => {
      result.current.editRps(250);
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });

    const req = getLatestRequest();
    expect(req.url).toBe(
      '/api/domains/cadence-batcher/cluster0/workflows/batch-1/run-1/signal'
    );
    expect(req.body).toEqual({
      signalName: 'cadence-sys-batch-tune-signal',
      signalInput: '{"RPS":250}',
    });
  });

  it('invalidates the describe query and shows a success snackbar', async () => {
    const { result } = setup({});

    act(() => {
      result.current.editRps(250);
    });

    await waitFor(() => {
      expect(mockEnqueue).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'RPS updated' }),
        DURATION.short
      );
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: [
        'describeBatchAction',
        {
          domain: 'cadence-samples',
          cluster: 'cluster0',
          workflowId: 'batch-1',
          runId: 'run-1',
        },
      ],
    });
  });

  it('shows an error snackbar on failure', async () => {
    const onSuccess = jest.fn();
    const { result } = setup({ onSuccess, error: true });

    act(() => {
      result.current.editRps(250);
    });

    await waitFor(() => {
      expect(mockEnqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Failed to signal',
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
  let latestRequest: { url: string; body: unknown } = { url: '', body: null };

  const utils = renderHook(
    () =>
      useEditBatchActionRps({
        domain: 'cadence-samples',
        cluster: 'cluster0',
        workflowId: 'batch-1',
        runId: 'run-1',
        onSuccess,
      }),
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/signal',
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
                { message: 'Failed to signal' },
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
