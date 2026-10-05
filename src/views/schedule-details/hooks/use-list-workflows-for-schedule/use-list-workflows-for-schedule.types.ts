import {
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import {
  type ListWorkflowsResponse,
  type RouteParams as ListWorkflowsRouteParams,
} from '@/route-handlers/list-workflows/list-workflows.types';
import { type RequestError } from '@/utils/request/request-error';

export type UseListWorkflowsForScheduleParams = ListWorkflowsRouteParams & {
  scheduleId: string;
  pageSize: number;
  refetchIntervalMs?: number;
  /**
   * Any value that changes when the schedule takes a new action, such as
   * `ScheduleInfo.totalRuns`. Refreshes the loaded runs as soon as it changes,
   * so new runs do not have to wait for the periodic refresh. Deliberately not
   * part of the query key: re-keying would drop the pages already loaded.
   */
  runsRevision?: string;
};

export type ListWorkflowsForScheduleQueryParams = Omit<
  UseListWorkflowsForScheduleParams,
  'refetchIntervalMs' | 'runsRevision'
>;

export type ListWorkflowsForScheduleQueryKey = [
  'listWorkflowsForSchedule',
  ListWorkflowsForScheduleQueryParams,
];

export type ListWorkflowsForScheduleQueryOptions = UseInfiniteQueryOptions<
  ListWorkflowsResponse,
  RequestError,
  InfiniteData<ListWorkflowsResponse>,
  ListWorkflowsResponse,
  ListWorkflowsForScheduleQueryKey,
  string | undefined
>;
