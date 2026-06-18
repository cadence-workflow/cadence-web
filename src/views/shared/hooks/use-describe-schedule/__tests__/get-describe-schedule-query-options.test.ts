import { type Query } from '@tanstack/react-query';

import {
  getMockPausedDescribeScheduleResponse,
  getMockRunningDescribeScheduleResponse,
} from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import { type RequestError } from '@/utils/request/request-error';

import getDescribeScheduleQueryOptions from '../get-describe-schedule-query-options';
import {
  type DescribeScheduleQueryKey,
  type DescribeScheduleResponse,
} from '../use-describe-schedule.types';

const params = {
  domain: 'test-domain',
  cluster: 'test-cluster',
  scheduleId: 'test-schedule-id',
};

const mockRunningDescribeScheduleResponse =
  getMockRunningDescribeScheduleResponse();

const mockPausedDescribeScheduleResponse =
  getMockPausedDescribeScheduleResponse();

type RefetchTypeIntervalArg = Query<
  DescribeScheduleResponse,
  RequestError,
  DescribeScheduleResponse,
  DescribeScheduleQueryKey
>;

describe(getDescribeScheduleQueryOptions.name, () => {
  it('returns namespaced queryKey including domain, cluster, and scheduleId', () => {
    const options = getDescribeScheduleQueryOptions(params);
    expect(options.queryKey).toEqual(['describeSchedule', params]);
  });

  it('returns refetchInterval of 10s by default when schedule is running', () => {
    const options = getDescribeScheduleQueryOptions(params);
    const refetchInterval = options.refetchInterval;

    if (typeof refetchInterval !== 'function') {
      throw new Error('Expected refetchInterval to be a function');
    }

    const mockQuery = {
      state: {
        data: mockRunningDescribeScheduleResponse as DescribeScheduleResponse,
      },
    } as RefetchTypeIntervalArg;

    expect(refetchInterval(mockQuery)).toBe(10_000);
  });

  it('returns refetchInterval false when schedule is paused', () => {
    const options = getDescribeScheduleQueryOptions(params);
    const refetchInterval = options.refetchInterval;

    if (typeof refetchInterval !== 'function') {
      throw new Error('Expected refetchInterval to be a function');
    }

    const mockQuery = {
      state: {
        data: mockPausedDescribeScheduleResponse as DescribeScheduleResponse,
      },
    } as RefetchTypeIntervalArg;

    expect(refetchInterval(mockQuery)).toBe(false);
  });

  it('uses custom runningScheduleRefetchIntervalMs when provided', () => {
    const options = getDescribeScheduleQueryOptions({
      ...params,
      runningScheduleRefetchIntervalMs: 5_000,
    });
    const refetchInterval = options.refetchInterval;

    if (typeof refetchInterval !== 'function') {
      throw new Error('Expected refetchInterval to be a function');
    }

    const mockQuery = {
      state: {
        data: mockRunningDescribeScheduleResponse as DescribeScheduleResponse,
      },
    } as RefetchTypeIntervalArg;

    expect(refetchInterval(mockQuery)).toBe(5_000);
  });

  it('does not include runningScheduleRefetchIntervalMs in queryKey', () => {
    const options = getDescribeScheduleQueryOptions({
      ...params,
      runningScheduleRefetchIntervalMs: 5_000,
    });

    expect(options.queryKey).toEqual(['describeSchedule', params]);
  });
});
