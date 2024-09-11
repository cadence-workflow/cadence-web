import React from 'react';

import { type TagKind } from 'baseui/tag';

import { render, screen } from '@/test-utils/rtl';

import { mockTaskList } from '@/views/task-list-page/__fixtures__/mock-task-list';

import TaskListLabel from '../task-list-label';

jest.mock('baseui/tag', () => ({
  ...jest.requireActual('baseui/tag'),
  Tag: jest.fn(({ kind, children }) => (
    <div data-testid={`mock-tag-${kind}`}>{children}</div>
  )),
}));

describe(TaskListLabel.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const tests: Array<{
    name: string;
    numWorkers: number;
    text: string;
    kind: TagKind;
  }> = [
    {
      name: 'should render multiple workers correctly',
      numWorkers: 2,
      text: '2 workers',
      kind: 'accent',
    },
    {
      name: 'should render one worker correctly',
      numWorkers: 1,
      text: '1 worker',
      kind: 'accent',
    },
    {
      name: 'should render no workers correctly',
      numWorkers: 0,
      text: '0 workers',
      kind: 'negative',
    },
  ];

  tests.forEach((test) => {
    it(test.name, () => {
      render(
        <TaskListLabel
          taskList={{
            ...mockTaskList,
            pollers: mockTaskList.pollers.slice(0, test.numWorkers),
          }}
        />
      );

      expect(screen.getByText(test.text)).toBeInTheDocument();
      expect(screen.getByTestId(`mock-tag-${test.kind}`)).toBeInTheDocument();
    });
  });
});
