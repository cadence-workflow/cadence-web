import { act } from '@testing-library/react';

import { useQueryClient } from '@tanstack/react-query';
import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import useCreateSchedule from '../use-create-schedule';
import { type UseCreateScheduleVariables } from '../use-create-schedule.types';

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryClient: jest.fn(),
}));

const MOCK_DOMAIN = 'test-domain';
const MOCK_CLUSTER = 'test-cluster';

const VALID_CREATE_SCHEDULE_BODY: UseCreateScheduleVariables = {
  scheduleId: 'my-schedule',
  spec: {
    cronExpression: '0 9 * * *',
  },
  action: {
    startWorkflow: {
      workflowType: { name: 'DemoWorkflow' },
      taskList: { name: 'demo-task-list' },
      workerSDKLanguage: 'GO',
      workflowIdPrefix: 'scheduled-demo-',
      executionStartToCloseTimeoutSeconds: 3600,
    },
  },
};

describe(useCreateSchedule.name, () => {
  let mockInvalidateQueries: jest.Mock;

  beforeEach(() => {
    mockInvalidateQueries = jest.fn();
    (useQueryClient as jest.Mock).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    });
  });

  it('exposes isPending as false initially', () => {
    const { result } = setup({});

    expect(result.current.isPending).toBe(false);
  });

  it('sets isPending to true while mutation is in-flight', async () => {
    let resolveRequest: (() => void) | undefined;
    const blockingPromise = new Promise<void>((resolve) => {
      resolveRequest = resolve;
    });

    const { result } = setup({
      httpResolver: async () => {
        await blockingPromise;
        return HttpResponse.json({});
      },
    });

    act(() => {
      result.current.mutate(VALID_CREATE_SCHEDULE_BODY);
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    act(() => {
      resolveRequest?.();
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
  });

  it('invalidates listSchedules queries on success', async () => {
    const { result } = setup({});

    await act(async () => {
      await result.current.mutateAsync(VALID_CREATE_SCHEDULE_BODY);
    });

    expect(mockInvalidateQueries).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [
          'listSchedules',
          { domain: MOCK_DOMAIN, cluster: MOCK_CLUSTER },
        ],
      })
    );
  });

  it('sets isSuccess to true after successful mutation', async () => {
    const { result } = setup({});

    await act(async () => {
      await result.current.mutateAsync(VALID_CREATE_SCHEDULE_BODY);
    });

    expect(result.current.isSuccess).toBe(true);
  });

  it('surfaces error from API on 400 failure', async () => {
    const { result } = setup({
      httpResolver: async () =>
        HttpResponse.json(
          {
            message: 'Invalid values provided for schedule create',
            validationErrors: [
              { code: 'too_small', path: ['scheduleId'], message: 'Too small' },
            ],
          },
          { status: 400 }
        ),
    });

    await act(async () => {
      try {
        await result.current.mutateAsync(VALID_CREATE_SCHEDULE_BODY);
      } catch {
        // expected to throw
      }
    });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    expect(result.current.error?.status).toBe(400);
    expect(result.current.error?.message).toBe(
      'Invalid values provided for schedule create'
    );
    expect(result.current.error?.validationErrors).toHaveLength(1);
  });

  it('surfaces error from API on 409 conflict', async () => {
    const { result } = setup({
      httpResolver: async () =>
        HttpResponse.json(
          { message: 'Schedule already exists' },
          { status: 409 }
        ),
    });

    await act(async () => {
      try {
        await result.current.mutateAsync(VALID_CREATE_SCHEDULE_BODY);
      } catch {
        // expected to throw
      }
    });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    expect(result.current.error?.status).toBe(409);
    expect(result.current.error?.message).toBe('Schedule already exists');
  });

  it('resets mutation state after calling reset()', async () => {
    const { result } = setup({
      httpResolver: async () =>
        HttpResponse.json(
          { message: 'Schedule already exists' },
          { status: 409 }
        ),
    });

    await act(async () => {
      try {
        await result.current.mutateAsync(VALID_CREATE_SCHEDULE_BODY);
      } catch {
        // expected to throw
      }
    });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    await act(async () => {
      result.current.reset();
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
    expect(result.current.isSuccess).toBe(false);
  });

  it('does not invalidate queries on failure', async () => {
    const { result } = setup({
      httpResolver: async () =>
        HttpResponse.json(
          { message: 'Schedule already exists' },
          { status: 409 }
        ),
    });

    await act(async () => {
      try {
        await result.current.mutateAsync(VALID_CREATE_SCHEDULE_BODY);
      } catch {
        // expected to throw
      }
    });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    expect(mockInvalidateQueries).not.toHaveBeenCalled();
  });
});

function setup({
  httpResolver,
}: {
  httpResolver?: () => ReturnType<typeof HttpResponse.json> | Promise<ReturnType<typeof HttpResponse.json>>;
} = {}) {
  const { result } = renderHook(
    () => useCreateSchedule({ domain: MOCK_DOMAIN, cluster: MOCK_CLUSTER }),
    {
      endpointsMocks: [
        {
          path: `/api/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}/schedules`,
          httpMethod: 'POST',
          mockOnce: false,
          httpResolver: httpResolver ?? (async () => HttpResponse.json({})),
        },
      ],
    }
  );

  return { result };
}
