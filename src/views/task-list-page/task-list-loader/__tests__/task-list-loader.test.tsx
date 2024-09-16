import { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen, act } from '@/test-utils/rtl';

import { type DescribeTaskListResponse } from '@/route-handlers/describe-task-list/describe-task-list.types';
import type { Props as TaskListLabelProps } from '@/views/shared/task-list-label/task-list-label.types';

import { mockTaskList } from '../../__fixtures__/mock-task-list';
import { type Props as TaskListTableProps } from '../../task-list-workers-table/task-list-workers-table.types';
import TaskListLoader from '../task-list-loader';

jest.mock('../../task-list-workers-table/task-list-workers-table', () =>
  jest.fn(({ taskList }: TaskListTableProps) => (
    <div>
      {taskList.workers.map((w) => (
        <div key={w.identity}>{w.identity}</div>
      ))}
    </div>
  ))
);

jest.mock('../../task-list-filters/task-list-filters', () =>
  jest.fn(() => <div>Mock task list filters</div>)
);

jest.mock('@/views/shared/task-list-label/task-list-label', () =>
  jest.fn(({ taskList }: TaskListLabelProps) => (
    <div>
      {taskList.name}: {taskList.workers.length} workers
    </div>
  ))
);

describe(TaskListLoader.name, () => {
  it('renders task list without error', async () => {
    await setup({});

    expect(
      await screen.findByText('tasklist-1: 3 workers')
    ).toBeInTheDocument();

    expect(
      await screen.findByText(/poller-1@mock-domain@tasklist-1/)
    ).toBeInTheDocument();
  });

  it('does not render if the initial call fails', async () => {
    let renderErrorMessage;
    try {
      await act(async () => {
        await setup({ error: true });
      });
    } catch (error) {
      if (error instanceof Error) {
        renderErrorMessage = error.message;
      }
    }

    expect(renderErrorMessage).toEqual('Failed to fetch task list');
  });
});

async function setup({ error }: { error?: boolean }) {
  render(
    <Suspense>
      <TaskListLoader
        domain="mock-domain"
        cluster="mock-cluster"
        taskListName="tasklist-1"
      />
    </Suspense>,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/task-list/:taskListName',
          httpMethod: 'GET',
          ...(error
            ? {
                httpResolver: () => {
                  return HttpResponse.json(
                    { message: 'Failed to fetch task list' },
                    { status: 500 }
                  );
                },
              }
            : {
                jsonResponse: {
                  taskList: mockTaskList,
                } satisfies DescribeTaskListResponse,
              }),
        },
      ],
    }
  );
}
