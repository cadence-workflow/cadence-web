import queryString from 'query-string';

import { type ListWorkflowsRequestQueryParams } from '@/route-handlers/list-workflows/list-workflows.types';
import request from '@/utils/request';

import buildScheduleWorkflowsVisibilityQuery from './build-schedule-workflows-visibility-query';
import {
  SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN,
  SCHEDULE_WORKFLOWS_VISIBILITY_SORT_ORDER,
} from './use-list-workflows-for-schedule.constants';
import {
  type ListWorkflowsForScheduleQueryKey,
  type UseListWorkflowsForScheduleParams,
  type UseListWorkflowsForScheduleQueryOptions,
} from './use-list-workflows-for-schedule.types';

export default function getListWorkflowsForScheduleQueryOptions({
  domain,
  cluster,
  scheduleId,
  pageSize,
}: UseListWorkflowsForScheduleParams): UseListWorkflowsForScheduleQueryOptions {
  const params = { domain, cluster, scheduleId, pageSize };

  return {
    queryKey: [
      'listWorkflowsForSchedule',
      params,
    ] satisfies ListWorkflowsForScheduleQueryKey,
    queryFn: ({ pageParam }) =>
      request(
        queryString.stringifyUrl({
          url: `/api/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows`,
          query: {
            listType: 'default',
            inputType: 'query',
            query: buildScheduleWorkflowsVisibilityQuery(scheduleId),
            sortColumn: SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN,
            sortOrder: SCHEDULE_WORKFLOWS_VISIBILITY_SORT_ORDER,
            pageSize: pageSize.toString(),
            nextPage: pageParam,
          } as const satisfies ListWorkflowsRequestQueryParams,
        })
      ).then((res) => res.json()),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
  };
}
