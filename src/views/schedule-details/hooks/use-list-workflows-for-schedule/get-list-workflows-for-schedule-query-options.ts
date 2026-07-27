import queryString from 'query-string';

import { type ListWorkflowsRequestQueryParams } from '@/route-handlers/list-workflows/list-workflows.types';
import request from '@/utils/request';

import buildScheduleWorkflowsVisibilityQuery from './build-schedule-workflows-visibility-query';
import {
  type ListWorkflowsForScheduleQueryKey,
  type ListWorkflowsForScheduleQueryOptions,
  type ListWorkflowsForScheduleQueryParams,
  type UseListWorkflowsForScheduleParams,
} from './use-list-workflows-for-schedule.types';

export default function getListWorkflowsForScheduleQueryOptions({
  refetchIntervalMs,
  runsRevision: _runsRevision,
  ...params
}: UseListWorkflowsForScheduleParams): ListWorkflowsForScheduleQueryOptions {
  return {
    queryKey: [
      'listWorkflowsForSchedule',
      params,
    ] satisfies ListWorkflowsForScheduleQueryKey,
    queryFn: ({ pageParam }) => fetchWorkflowsForSchedule(params, pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
    // ponytail: each refresh re-walks every loaded page, re-deriving each page
    // token from the page fetched before it. That is what keeps the loaded runs
    // contiguous as new runs push older ones onto later pages, and it refreshes
    // the status of older runs for free. Since it costs one request per loaded
    // page, callers should pair a slow interval here with `runsRevision`, which
    // refreshes as soon as the schedule actually acts. The ceiling is how
    // quickly an older run's status settles: nothing but this interval notices
    // a workflow that finishes without the schedule taking a new action.
    refetchInterval: refetchIntervalMs,
  };
}

function fetchWorkflowsForSchedule(
  {
    domain,
    cluster,
    scheduleId,
    pageSize,
  }: ListWorkflowsForScheduleQueryParams,
  nextPage?: string
) {
  return request(
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
  ).then((res) => res.json());
}
