import { type UseQueryOptions } from '@tanstack/react-query';

import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import {
  type DescribeScheduleDTO,
  type DescribeScheduleQueryKey,
  type UseDescribeScheduleParams,
} from './use-describe-schedule.types';

const DESCRIBE_SCHEDULE_REFETCH_INTERVAL_MS = 10_000;

function isScheduleRunning(data: DescribeScheduleDTO): boolean {
  return data.state?.paused === false;
}

export function getDescribeScheduleQueryKey(
  params: UseDescribeScheduleParams
): DescribeScheduleQueryKey {
  return ['describeSchedule', params];
}

export default function getDescribeScheduleQueryOptions(
  params: UseDescribeScheduleParams
): UseQueryOptions<
  DescribeScheduleDTO,
  RequestError,
  DescribeScheduleDTO,
  DescribeScheduleQueryKey
> {
  const { domain, cluster, scheduleId } = params;
  return {
    queryKey: getDescribeScheduleQueryKey(params),
    queryFn: ({ queryKey: [_, p] }) =>
      request(
        `/api/domains/${encodeURIComponent(p.domain)}/${encodeURIComponent(p.cluster)}/schedules/${encodeURIComponent(p.scheduleId)}`
      ).then((res) => res.json()),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && isScheduleRunning(data)) {
        return DESCRIBE_SCHEDULE_REFETCH_INTERVAL_MS;
      }
      return false;
    },
  };
}
