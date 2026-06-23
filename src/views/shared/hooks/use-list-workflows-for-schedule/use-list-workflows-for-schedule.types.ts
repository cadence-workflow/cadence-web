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
};

export type ListWorkflowsForScheduleQueryKey = [
  'listWorkflowsForSchedule',
  UseListWorkflowsForScheduleParams,
];

export type UseListWorkflowsForScheduleQueryOptions = UseInfiniteQueryOptions<
  ListWorkflowsResponse,
  RequestError,
  InfiniteData<ListWorkflowsResponse>,
  ListWorkflowsResponse,
  ListWorkflowsForScheduleQueryKey,
  string | undefined
>;
