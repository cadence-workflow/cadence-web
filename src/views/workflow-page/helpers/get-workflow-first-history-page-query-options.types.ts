import { type UseQueryOptions } from '@tanstack/react-query';

import { type GetWorkflowHistoryResponse } from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import { type RequestError } from '@/utils/request/request-error';

export type WorkflowFirstHistoryPageQueryParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
};

export type WorkflowFirstHistoryPageQueryKey = [
  'workflow_history',
  WorkflowFirstHistoryPageQueryParams & { pageSize: 1 },
];

export type WorkflowFirstHistoryPageQueryOptions = UseQueryOptions<
  GetWorkflowHistoryResponse,
  RequestError,
  GetWorkflowHistoryResponse,
  WorkflowFirstHistoryPageQueryKey
>;
