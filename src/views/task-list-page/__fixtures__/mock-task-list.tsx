import { type TaskList } from '@/route-handlers/describe-task-list/describe-task-list.types';

export const mockTaskList: TaskList = {
  name: 'tasklist-1',
  pollers: [
    {
      activityHandler: true,
      decisionHandler: true,
      identity: 'poller-1@mock-domain@tasklist-1',
      lastAccessTime: 1725370657336.2053,
      ratePerSecond: 100000,
    },
    {
      activityHandler: true,
      decisionHandler: true,
      identity: 'poller-2@mock-domain@tasklist-1',
      lastAccessTime: 1725370636402.4927,
      ratePerSecond: 100000,
    },
  ],
  decisionTaskListStatus: null,
  activityTaskListStatus: null,
};
