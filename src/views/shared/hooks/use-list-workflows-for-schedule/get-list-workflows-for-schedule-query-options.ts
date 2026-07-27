import queryString from 'query-string';

import { type ListWorkflowsRequestQueryParams } from '@/route-handlers/list-workflows/list-workflows.types';
import request from '@/utils/request';

import buildScheduleWorkflowsVisibilityQuery from './build-schedule-workflows-visibility-query';
import {
  type HistoricalWorkflowsForScheduleQueryKey,
  type HistoricalWorkflowsForScheduleQueryOptions,
  type LatestWorkflowsForScheduleQueryKey,
  type LatestWorkflowsForScheduleQueryOptions,
  type ListWorkflowsForScheduleQueryParams,
  type UseListWorkflowsForScheduleParams,
} from './use-list-workflows-for-schedule.types';

export function getLatestWorkflowsForScheduleQueryOptions({
  refetchIntervalMs,
  ...params
}: UseListWorkflowsForScheduleParams): LatestWorkflowsForScheduleQueryOptions {
  return {
    queryKey: [
      'listLatestWorkflowsForSchedule',
      params,
    ] satisfies LatestWorkflowsForScheduleQueryKey,
    queryFn: () => fetchWorkflowsForSchedule(params),
    refetchInterval: refetchIntervalMs,
  };
}

export function getHistoricalWorkflowsForScheduleQueryOptions({
  initialPageParam,
  params,
}: {
  initialPageParam: string | undefined;
  params: ListWorkflowsForScheduleQueryParams;
}): HistoricalWorkflowsForScheduleQueryOptions {
  return {
    queryKey: [
      'listHistoricalWorkflowsForSchedule',
      params,
      initialPageParam,
    ] satisfies HistoricalWorkflowsForScheduleQueryKey,
    queryFn: ({ pageParam }) => fetchWorkflowsForSchedule(params, pageParam),
    initialPageParam,
    getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
    enabled: false,
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
