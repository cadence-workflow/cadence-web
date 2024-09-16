import {
  mockDecisionTaskListResponse,
  mockActivityTaskListResponse,
} from '../../__fixtures__/mock-task-list-response';
import getWorkersForTaskList from '../get-workers-for-task-list';

const MOCK_WORKERS_RESPONSE_MIXED = [
  {
    hasActivityHandler: true,
    hasDecisionHandler: true,
    identity: 'poller-1@mock-domain@tasklist-1',
    lastAccessTime: 1725370657336.2053,
    ratePerSecond: 100000,
  },
  {
    hasActivityHandler: true,
    hasDecisionHandler: true,
    identity: 'poller-2@mock-domain@tasklist-1',
    lastAccessTime: 1725370636402.4927,
    ratePerSecond: 100000,
  },
];

const MOCK_WORKERS_RESPONSE_DECISION = [
  {
    hasActivityHandler: false,
    hasDecisionHandler: true,
    identity: 'poller-1@mock-domain@tasklist-1',
    lastAccessTime: 1725370637431.4446,
    ratePerSecond: 100000,
  },
  {
    hasActivityHandler: false,
    hasDecisionHandler: true,
    identity: 'poller-2@mock-domain@tasklist-1',
    lastAccessTime: 1725370636402.4927,
    ratePerSecond: 100000,
  },
];

const MOCK_WORKERS_RESPONSE_ACTIVITY = [
  {
    hasActivityHandler: true,
    hasDecisionHandler: false,
    identity: 'poller-1@mock-domain@tasklist-1',
    lastAccessTime: 1725370657336.2053,
    ratePerSecond: 100000,
  },
  {
    hasActivityHandler: true,
    hasDecisionHandler: false,
    identity: 'poller-2@mock-domain@tasklist-1',
    lastAccessTime: 1725370630347.1936,
    ratePerSecond: 100000,
  },
];

describe(getWorkersForTaskList.name, () => {
  it('should return workers with lastAccessTime being latest of decision/activity worker accessTime', () => {
    const res = getWorkersForTaskList({
      decisionTaskList: mockDecisionTaskListResponse,
      activityTaskList: mockActivityTaskListResponse,
    });

    expect(res).toEqual(MOCK_WORKERS_RESPONSE_MIXED);
  });

  it('should return decision workers if the tasklist has no activity workers', () => {
    const res = getWorkersForTaskList({
      decisionTaskList: mockDecisionTaskListResponse,
      activityTaskList: undefined,
    });

    expect(res).toEqual(MOCK_WORKERS_RESPONSE_DECISION);
  });

  it('should return activity workers if the tasklist has no decision workers', () => {
    const res = getWorkersForTaskList({
      decisionTaskList: undefined,
      activityTaskList: mockActivityTaskListResponse,
    });

    expect(res).toEqual(MOCK_WORKERS_RESPONSE_ACTIVITY);
  });
});
