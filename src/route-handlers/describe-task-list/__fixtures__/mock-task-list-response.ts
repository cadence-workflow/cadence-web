import { type DescribeTaskListResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeTaskListResponse';

export const mockDecisionTaskListResponse: DescribeTaskListResponse = {
  pollers: [
    {
      lastAccessTime: {
        seconds: '1725370637',
        nanos: 431444568,
      },
      identity: 'poller-1@mock-domain@tasklist-1',
      ratePerSecond: 100000,
    },
    {
      lastAccessTime: {
        seconds: '1725370636',
        nanos: 402492620,
      },
      identity: 'poller-2@mock-domain@tasklist-1',
      ratePerSecond: 100000,
    },
  ],
  taskListStatus: null,
};

export const mockActivityTaskListResponse: DescribeTaskListResponse = {
  pollers: [
    {
      lastAccessTime: {
        seconds: '1725370657',
        nanos: 336205308,
      },
      identity: 'poller-1@mock-domain@tasklist-1',
      ratePerSecond: 100000,
    },
    {
      lastAccessTime: {
        seconds: '1725370630',
        nanos: 347193652,
      },
      identity: 'poller-2@mock-domain@tasklist-1',
      ratePerSecond: 100000,
    },
  ],
  taskListStatus: null,
};
