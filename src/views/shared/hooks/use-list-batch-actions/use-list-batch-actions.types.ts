import {
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import {
  type ListBatchActionsResponse,
  type RouteParams as ListBatchActionsRouteParams,
} from '@/route-handlers/list-batch-actions/list-batch-actions.types';
import { type RequestError } from '@/utils/request/request-error';

export type ListBatchActionsQueryKey = [
  'listBatchActions',
  ListBatchActionsRouteParams & { pageSize: number },
];

export type UseListBatchActionsQueryOptions = UseInfiniteQueryOptions<
  ListBatchActionsResponse,
  RequestError,
  InfiniteData<ListBatchActionsResponse>,
  ListBatchActionsResponse,
  ListBatchActionsQueryKey,
  string | undefined
>;

export type UseListBatchActionsParams = ListBatchActionsRouteParams & {
  pageSize: number;
} & Partial<UseListBatchActionsQueryOptions>;
