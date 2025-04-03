import { type ResetWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/ResetWorkflowExecutionResponse';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

export type RouteParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type ResetWorkflowResponse = ResetWorkflowExecutionResponse;

export type Context = DefaultMiddlewaresContext;
