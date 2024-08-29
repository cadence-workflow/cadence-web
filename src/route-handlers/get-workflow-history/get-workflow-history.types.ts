import { type GetWorkflowExecutionHistoryResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/GetWorkflowExecutionHistoryResponse';

export type RouteParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type GetWorkflowHistoryResponse = GetWorkflowExecutionHistoryResponse;
