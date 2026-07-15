import request from '@/utils/request';
import { formatScheduleDetails } from './format-schedule-details';

import {
  type DescribeScheduleQueryKey,
  type DescribeScheduleResponse,
  type UseDescribeScheduleParams,
  type UseDescribeScheduleQueryOptions,
} from './use-describe-schedule.types';

export default function getDescribeScheduleQueryOptions({
  domain,
  cluster,
  scheduleId,
  runningScheduleRefetchIntervalMs = 10000, // 10 seconds
  ...queryOptions
}: UseDescribeScheduleParams): UseDescribeScheduleQueryOptions {
  const params = { domain, cluster, scheduleId };

  return {
    queryKey: ['describeSchedule', params] satisfies DescribeScheduleQueryKey,
    queryFn: ({ queryKey: [_, p] }: { queryKey: DescribeScheduleQueryKey }) =>
      request(
        `/api/domains/${encodeURIComponent(p.domain)}/${encodeURIComponent(p.cluster)}/schedules/${encodeURIComponent(p.scheduleId)}`
      ).then(async (res) =>
        formatScheduleDetails((await res.json()) as DescribeScheduleResponse)
      ),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.state?.paused === false) {
        return runningScheduleRefetchIntervalMs;
      }
      return false;
    },
    ...queryOptions,
  };
}
