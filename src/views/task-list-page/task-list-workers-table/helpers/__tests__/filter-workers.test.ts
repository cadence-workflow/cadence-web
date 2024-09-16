import { type TaskListType } from '@/__generated__/proto-ts/uber/cadence/api/v1/TaskListType';
import { mockTaskList } from '@/views/task-list-page/__fixtures__/mock-task-list';

import filterWorkers from '../filter-workers';

describe(filterWorkers.name, () => {
  const tests: Array<{
    name: string;
    handlerType?: TaskListType;
    search?: string;
    expectedTaskListIdentities: Array<string>;
  }> = [
    {
      name: 'does not filter anything if filter params are empty',
      expectedTaskListIdentities: [
        'poller-1@mock-domain@tasklist-1',
        'poller-2@mock-domain@tasklist-1',
        'poller-3@mock-domain@tasklist-1',
      ],
    },
    {
      name: 'filters for decision workers',
      handlerType: 'TASK_LIST_TYPE_DECISION',
      expectedTaskListIdentities: [
        'poller-2@mock-domain@tasklist-1',
        'poller-3@mock-domain@tasklist-1',
      ],
    },
    {
      name: 'filters for activity workers',
      handlerType: 'TASK_LIST_TYPE_ACTIVITY',
      expectedTaskListIdentities: [
        'poller-1@mock-domain@tasklist-1',
        'poller-3@mock-domain@tasklist-1',
      ],
    },
    {
      name: 'does not filter if handlerType is invalid',
      handlerType: 'TASK_LIST_TYPE_INVALID',
      expectedTaskListIdentities: [
        'poller-1@mock-domain@tasklist-1',
        'poller-2@mock-domain@tasklist-1',
        'poller-3@mock-domain@tasklist-1',
      ],
    },
    {
      name: 'filters by search string',
      search: 'poller-1',
      expectedTaskListIdentities: ['poller-1@mock-domain@tasklist-1'],
    },
  ];

  tests.forEach((test) => {
    it(test.name, () => {
      expect(
        filterWorkers({
          workers: mockTaskList.workers,
          handlerType: test.handlerType,
          search: test.search,
        })
      ).toEqual(
        test.expectedTaskListIdentities.map((identity) =>
          expect.objectContaining({ identity })
        )
      );
    });
  });
});
