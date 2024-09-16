import { type TaskList } from '@/route-handlers/describe-task-list/describe-task-list.types';

export const mockTaskList: TaskList = {
  name: 'tasklist-1',
  workers: [
    {
      hasActivityHandler: true,
      hasDecisionHandler: false,
      identity: 'poller-1@mock-domain@tasklist-1',
      lastAccessTime: 1725370657336.2053,
      ratePerSecond: 100000,
    },
    {
      hasActivityHandler: false,
      hasDecisionHandler: true,
      identity: 'poller-2@mock-domain@tasklist-1',
      lastAccessTime: 1725370636402.4927,
      ratePerSecond: 100000,
    },
    {
      hasActivityHandler: true,
      hasDecisionHandler: true,
      identity: 'poller-3@mock-domain@tasklist-1',
      lastAccessTime: 1725370657000,
      ratePerSecond: 100000,
    },
  ],
  decisionTaskListStatus: null,
  activityTaskListStatus: null,
};
