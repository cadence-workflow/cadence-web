import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { mockTaskList } from '@/views/task-list-page/__fixtures__/mock-task-list';

import TaskListLabel from '../task-list-label';

jest.mock(
  '@/views/shared/task-list-workers-badge/task-list-workers-badge',
  () =>
    function MockTaskListWorkersBadge({
      variant,
      count,
    }: {
      variant: string;
      count?: number;
    }) {
      return (
        <div data-testid="task-list-workers-badge">{`${variant}:${count}`}</div>
      );
    }
);

describe(TaskListLabel.name, () => {
  it('renders the task list name and workers badge', () => {
    setup({ numWorkers: 2 });

    expect(screen.getByText(mockTaskList.name)).toBeInTheDocument();
    expect(screen.getByTestId('task-list-workers-badge')).toHaveTextContent(
      'workers:2'
    );
  });

  it('passes a zero worker count to the badge', () => {
    setup({ numWorkers: 0 });

    expect(screen.getByTestId('task-list-workers-badge')).toHaveTextContent(
      'workers:0'
    );
  });
});

function setup({ numWorkers }: { numWorkers: number }) {
  render(
    <TaskListLabel
      taskList={{
        ...mockTaskList,
        workers: mockTaskList.workers.slice(0, numWorkers),
      }}
    />
  );
}
