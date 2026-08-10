import { type Query } from '@tanstack/react-query';

import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import {
  type DescribeScheduleQueryKey,
  type DescribeScheduleResponse,
  type UseDescribeScheduleParams,
  type UseDescribeScheduleQueryOptions,
} from './use-describe-schedule.types';

export function describeScheduleThrowOnError(
  _err: RequestError,
  query: Query<
    DescribeScheduleResponse,
    RequestError,
    DescribeScheduleResponse,
    DescribeScheduleQueryKey
  >
): boolean {
  return query.state.data === undefined;
}

export default function getDescribeScheduleQueryOptions({
  domain,
  cluster,
  scheduleId,
  runningScheduleRefetchIntervalMs = 10000, // 10 seconds
  throwOnError,
  ...queryOptions
}: UseDescribeScheduleParams): UseDescribeScheduleQueryOptions {
  const params = { domain, cluster, scheduleId };

  return {
    queryKey: ['describeSchedule', params] satisfies DescribeScheduleQueryKey,
    queryFn: ({ queryKey: [_, p] }: { queryKey: DescribeScheduleQueryKey }) =>
      request(
        `/api/domains/${encodeURIComponent(p.domain)}/${encodeURIComponent(p.cluster)}/schedules/${encodeURIComponent(p.scheduleId)}`
      ).then((res) => res.json()),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.state?.paused === false) {
        return runningScheduleRefetchIntervalMs;
      }
      return false;
    },
    throwOnError:
      throwOnError === true ? describeScheduleThrowOnError : throwOnError,
    ...queryOptions,
  };
}
