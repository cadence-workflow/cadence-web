import {
  type InfiniteQueryObserver,
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import {
  type WorkflowHistoryQueryParams,
  type GetWorkflowHistoryResponse,
  type RouteParams,
} from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import { type RequestError } from '@/utils/request/request-error';

export type WorkflowHistoryReactQueryParams = RouteParams &
  WorkflowHistoryQueryParams;

export type WorkflowHistoryInfiniteQueryObserver = InfiniteQueryObserver<
  GetWorkflowHistoryResponse,
  RequestError,
  InfiniteData<GetWorkflowHistoryResponse>,
  GetWorkflowHistoryResponse,
  WorkflowHistoryQueryKey,
  string | undefined
>;
export type WorkflowHistoryQueryKey = [string, WorkflowHistoryReactQueryParams];

export type WorkflowHistoryInfiniteQueryOptions = UseInfiniteQueryOptions<
  GetWorkflowHistoryResponse,
  RequestError,
  InfiniteData<GetWorkflowHistoryResponse>,
  GetWorkflowHistoryResponse,
  WorkflowHistoryQueryKey,
  string | undefined
>;
export type WorkflowHistoryQueryResult = ReturnType<
  WorkflowHistoryInfiniteQueryObserver['getCurrentResult']
>;

export type QueryResultOnChangeCallback = (
  state: WorkflowHistoryQueryResult
) => void;

export type ShouldContinueCallback = (
  state: WorkflowHistoryQueryResult
) => boolean;
