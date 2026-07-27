import {
  type InfiniteData,
  type UseInfiniteQueryOptions,
  type UseQueryOptions,
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
};

export type ListWorkflowsForScheduleQueryParams = Omit<
  UseListWorkflowsForScheduleParams,
  'refetchIntervalMs'
>;

export type LatestWorkflowsForScheduleQueryKey = [
  'listLatestWorkflowsForSchedule',
  ListWorkflowsForScheduleQueryParams,
];

export type HistoricalWorkflowsForScheduleQueryKey = [
  'listHistoricalWorkflowsForSchedule',
  ListWorkflowsForScheduleQueryParams,
  string | undefined,
];

export type LatestWorkflowsForScheduleQueryOptions = UseQueryOptions<
  ListWorkflowsResponse,
  RequestError,
  ListWorkflowsResponse,
  LatestWorkflowsForScheduleQueryKey
>;

export type HistoricalWorkflowsForScheduleQueryOptions =
  UseInfiniteQueryOptions<
    ListWorkflowsResponse,
    RequestError,
    InfiniteData<ListWorkflowsResponse>,
    ListWorkflowsResponse,
    HistoricalWorkflowsForScheduleQueryKey,
    string | undefined
  >;
