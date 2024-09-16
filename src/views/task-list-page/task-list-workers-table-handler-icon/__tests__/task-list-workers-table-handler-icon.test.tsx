import React from 'react';

import { render } from '@/test-utils/rtl';

import TaskListWorkersTableHandlerIcon from '../task-list-workers-table-handler-icon';

jest.mock('baseui/tag', () => ({
  ...jest.requireActual('baseui/tag'),
  Tag: jest.fn(({ kind, children }) => (
    <div data-testid={`mock-tag-${kind}`}>{children}</div>
  )),
}));

describe(TaskListWorkersTableHandlerIcon.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const tests: Array<{
    name: string;
    hasHandler: boolean;
  }> = [
    {
      name: 'should render correctly if worker has handler',
      hasHandler: true,
    },
    {
      name: 'should render correctly if worker does not have handler',
      hasHandler: false,
    },
  ];

  tests.forEach((test) => {
    it(test.name, () => {
      const { container } = render(
        <TaskListWorkersTableHandlerIcon hasHandler={test.hasHandler} />
      );

      expect(container).toMatchSnapshot();
    });
  });
});
