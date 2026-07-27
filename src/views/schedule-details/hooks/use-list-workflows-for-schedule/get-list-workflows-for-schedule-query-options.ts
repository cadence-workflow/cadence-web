import queryString from 'query-string';

import { type ListWorkflowsRequestQueryParams } from '@/route-handlers/list-workflows/list-workflows.types';
import request from '@/utils/request';

import buildScheduleWorkflowsVisibilityQuery from './build-schedule-workflows-visibility-query';
import {
  type ListWorkflowsForScheduleQueryKey,
  type ListWorkflowsForScheduleQueryOptions,
  type UseListWorkflowsForScheduleParams,
} from './use-list-workflows-for-schedule.types';

export default function getListWorkflowsForScheduleQueryOptions({
  refetchIntervalMs,
  runsRevision: _runsRevision,
  ...params
}: UseListWorkflowsForScheduleParams): ListWorkflowsForScheduleQueryOptions {
  const { domain, cluster, scheduleId, pageSize } = params;

  return {
    queryKey: [
      'listWorkflowsForSchedule',
      params,
    ] satisfies ListWorkflowsForScheduleQueryKey,
    queryFn: ({ pageParam: nextPage }) =>
      request(
        queryString.stringifyUrl({
          url: `/api/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows`,
          query: {
            listType: 'default',
            inputType: 'query',
            // Ordering rides inside the visibility query; the route handler passes
            // `query` through verbatim and ignores `sortColumn`/`sortOrder`.
            query: buildScheduleWorkflowsVisibilityQuery(scheduleId),
            pageSize: pageSize.toString(),
            nextPage,
          } as const satisfies ListWorkflowsRequestQueryParams,
        })
      ).then((res) => res.json()),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
    refetchInterval: refetchIntervalMs,
  };
}
