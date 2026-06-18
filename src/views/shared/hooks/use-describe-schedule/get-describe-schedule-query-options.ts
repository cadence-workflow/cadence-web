import request from '@/utils/request';

import {
  type DescribeScheduleQueryKey,
  type UseDescribeScheduleParams,
  type UseDescribeScheduleQueryOptions,
} from './use-describe-schedule.types';

export default function getDescribeScheduleQueryOptions({
  runningScheduleRefetchIntervalMs = 10000, // 10 seconds
  ...params
}: UseDescribeScheduleParams): UseDescribeScheduleQueryOptions {
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
  };
}
