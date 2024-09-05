import {
  mockDecisionTaskListResponse,
  mockActivityTaskListResponse,
} from '../../__fixtures__/mock-task-list-response';
import getPollersForTaskList from '../get-pollers-for-task-list';

const MOCK_POLLERS_RESPONSE_MIXED = [
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
];

const MOCK_POLLERS_RESPONSE_DECISION = [
  {
    activityHandler: false,
    decisionHandler: true,
    identity: 'poller-1@mock-domain@tasklist-1',
    lastAccessTime: 1725370637431.4446,
    ratePerSecond: 100000,
  },
  {
    activityHandler: false,
    decisionHandler: true,
    identity: 'poller-2@mock-domain@tasklist-1',
    lastAccessTime: 1725370636402.4927,
    ratePerSecond: 100000,
  },
];

const MOCK_POLLERS_RESPONSE_ACTIVITY = [
  {
    activityHandler: true,
    decisionHandler: false,
    identity: 'poller-1@mock-domain@tasklist-1',
    lastAccessTime: 1725370657336.2053,
    ratePerSecond: 100000,
  },
  {
    activityHandler: true,
    decisionHandler: false,
    identity: 'poller-2@mock-domain@tasklist-1',
    lastAccessTime: 1725370630347.1936,
    ratePerSecond: 100000,
  },
];

describe(getPollersForTaskList.name, () => {
  it('should return pollers with lastAccessTime being latest of decision/activity poller accessTime', () => {
    const res = getPollersForTaskList({
      decisionTaskList: mockDecisionTaskListResponse,
      activityTaskList: mockActivityTaskListResponse,
    });

    expect(res).toEqual(MOCK_POLLERS_RESPONSE_MIXED);
  });

  it('should return decision pollers if the tasklist has no activity pollers', () => {
    const res = getPollersForTaskList({
      decisionTaskList: mockDecisionTaskListResponse,
      activityTaskList: undefined,
    });

    expect(res).toEqual(MOCK_POLLERS_RESPONSE_DECISION);
  });

  it('should return activity pollers if the tasklist has no decision pollers', () => {
    const res = getPollersForTaskList({
      decisionTaskList: undefined,
      activityTaskList: mockActivityTaskListResponse,
    });

    expect(res).toEqual(MOCK_POLLERS_RESPONSE_ACTIVITY);
  });
});
