import {
  mockRunningDescribeScheduleResponse,
  mockPausedDescribeScheduleResponse,
} from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';

import getDescribeScheduleQueryOptions, {
  getDescribeScheduleQueryKey,
} from '../get-describe-schedule-query-options';
import { type DescribeScheduleDTO } from '../use-describe-schedule.types';

const params = {
  domain: 'test-domain',
  cluster: 'test-cluster',
  scheduleId: 'test-schedule-id',
};

describe(getDescribeScheduleQueryOptions.name, () => {
  it('returns namespaced queryKey including domain, cluster, and scheduleId', () => {
    const options = getDescribeScheduleQueryOptions(params);
    expect(options.queryKey).toEqual(['describeSchedule', params]);
  });

  it('returns refetchInterval of 10s when schedule is running', () => {
    const options = getDescribeScheduleQueryOptions(params);
    const refetchInterval = options.refetchInterval;

    if (typeof refetchInterval !== 'function') {
      throw new Error('Expected refetchInterval to be a function');
    }

    const mockQuery = {
      state: { data: mockRunningDescribeScheduleResponse },
    } as Parameters<typeof refetchInterval>[0];

    expect(refetchInterval(mockQuery)).toBe(10_000);
  });

  it('returns refetchInterval false when schedule is paused', () => {
    const options = getDescribeScheduleQueryOptions(params);
    const refetchInterval = options.refetchInterval;

    if (typeof refetchInterval !== 'function') {
      throw new Error('Expected refetchInterval to be a function');
    }

    const mockQuery = {
      state: { data: mockPausedDescribeScheduleResponse },
    } as Parameters<typeof refetchInterval>[0];

    expect(refetchInterval(mockQuery)).toBe(false);
  });

  it('returns refetchInterval false when data is undefined (initial load)', () => {
    const options = getDescribeScheduleQueryOptions(params);
    const refetchInterval = options.refetchInterval;

    if (typeof refetchInterval !== 'function') {
      throw new Error('Expected refetchInterval to be a function');
    }

    const mockQuery = {
      state: { data: undefined as unknown as DescribeScheduleDTO },
    } as Parameters<typeof refetchInterval>[0];

    expect(refetchInterval(mockQuery)).toBe(false);
  });

  it('encodes domain, cluster, scheduleId in the query URL', () => {
    const encodedParams = {
      domain: 'my domain',
      cluster: 'my cluster',
      scheduleId: 'schedule/id',
    };
    const options = getDescribeScheduleQueryOptions(encodedParams);
    const queryFn = options.queryFn;

    if (typeof queryFn !== 'function') {
      throw new Error('Expected queryFn to be a function');
    }

    const mockFetch = jest.fn().mockReturnValue({ json: jest.fn() });
    jest.mock('@/utils/request', () => mockFetch);
  });
});

describe(getDescribeScheduleQueryKey.name, () => {
  it('returns stable key for same params', () => {
    expect(getDescribeScheduleQueryKey(params)).toEqual(
      getDescribeScheduleQueryKey(params)
    );
  });

  it('returns different keys for different scheduleIds', () => {
    const key1 = getDescribeScheduleQueryKey({ ...params, scheduleId: 'a' });
    const key2 = getDescribeScheduleQueryKey({ ...params, scheduleId: 'b' });
    expect(key1).not.toEqual(key2);
  });
});
