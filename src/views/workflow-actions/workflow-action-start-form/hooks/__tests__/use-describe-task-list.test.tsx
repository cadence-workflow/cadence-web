import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import { type DescribeTaskListResponse } from '@/route-handlers/describe-task-list/describe-task-list.types';

import useDescribeTaskList from '../use-describe-task-list';

const mockTaskListResponse: DescribeTaskListResponse = {
  taskList: {
    name: 'test-task-list',
    workers: [
      {
        hasActivityHandler: true,
        hasDecisionHandler: true,
        identity: 'worker-1',
        lastAccessTime: 1725370657336,
        ratePerSecond: 100000,
      },
    ],
    decisionTaskListStatus: null,
    activityTaskListStatus: null,
  },
};

describe('useDescribeTaskList', () => {
  it('does not fetch when task list name is empty', () => {
    const { result } = setup({ taskListName: '' });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('fetches task list data', async () => {
    const { result } = setup({ taskListName: 'test-task-list' });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data?.taskList.name).toBe('test-task-list');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('sets isError when the API returns an error', async () => {
    const { result } = setup({
      taskListName: 'error-task-list',
      error: true,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });
});

function setup({
  taskListName,
  error,
}: {
  taskListName: string;
  error?: boolean;
}) {
  return renderHook(
    () =>
      useDescribeTaskList({
        domain: 'test-domain',
        cluster: 'test-cluster',
        taskListName,
      }),
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/task-list/:taskListName',
          httpMethod: 'GET' as const,
          ...(error
            ? {
                httpResolver: () =>
                  HttpResponse.json(
                    { message: 'Error fetching task list' },
                    { status: 500 }
                  ),
              }
            : {
                jsonResponse: mockTaskListResponse,
              }),
        },
      ],
    }
  );
}
