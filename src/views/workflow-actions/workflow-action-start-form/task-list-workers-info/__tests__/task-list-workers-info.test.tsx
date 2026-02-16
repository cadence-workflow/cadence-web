import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type DescribeTaskListResponse } from '@/route-handlers/describe-task-list/describe-task-list.types';

import TaskListWorkersInfo from '../task-list-workers-info';

describe(TaskListWorkersInfo.name, () => {
  it('renders nothing when both decision and activity handlers exist', () => {
    setup({
      data: {
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
      },
    });

    expect(
      screen.queryByTestId('task-list-workers-info')
    ).not.toBeInTheDocument();
  });

  it('renders warning when no workers have any handlers', () => {
    setup({
      data: {
        taskList: {
          name: 'empty-task-list',
          workers: [],
          decisionTaskListStatus: null,
          activityTaskListStatus: null,
        },
      },
    });

    expect(
      screen.getByText('This task list has no workers')
    ).toBeInTheDocument();
  });

  it('renders warning for missing activity workers when only decision handlers exist', () => {
    setup({
      data: {
        taskList: {
          name: 'decision-only-task-list',
          workers: [
            {
              hasActivityHandler: false,
              hasDecisionHandler: true,
              identity: 'worker-1',
              lastAccessTime: 1725370657336,
              ratePerSecond: 100000,
            },
          ],
          decisionTaskListStatus: null,
          activityTaskListStatus: null,
        },
      },
    });

    expect(
      screen.getByText('This task list has no activity workers')
    ).toBeInTheDocument();
  });

  it('renders warning for missing decision workers when only activity handlers exist', () => {
    setup({
      data: {
        taskList: {
          name: 'activity-only-task-list',
          workers: [
            {
              hasActivityHandler: true,
              hasDecisionHandler: false,
              identity: 'worker-1',
              lastAccessTime: 1725370657336,
              ratePerSecond: 100000,
            },
          ],
          decisionTaskListStatus: null,
          activityTaskListStatus: null,
        },
      },
    });

    expect(
      screen.getByText('This task list has no decision workers')
    ).toBeInTheDocument();
  });
});

function setup({ data }: { data: DescribeTaskListResponse }) {
  render(<TaskListWorkersInfo data={data} />);
}
