import {
  type InfiniteData,
  type InfiniteQueryObserverResult,
} from '@tanstack/react-query';

import {
  type WorkflowHistoryQueryParams,
  type GetWorkflowHistoryResponse,
} from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import { type RequestError } from '@/utils/request/request-error';

export type WorkflowHistoryQueryKey = [string, WorkflowHistoryQueryParams];

export type WorkflowHistoryQueryResult = InfiniteQueryObserverResult<
  InfiniteData<GetWorkflowHistoryResponse, unknown>,
  RequestError
>;
export type QueryResultOnChangeCallback = (
  state: WorkflowHistoryQueryResult
) => void;

export type ShouldContinueCallback = (
  state: WorkflowHistoryQueryResult
) => boolean;
