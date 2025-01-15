import { type RequestCancelWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/RequestCancelWorkflowExecutionResponse';
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

export type CancelWorkflowResponse = RequestCancelWorkflowExecutionResponse;

export type Context = DefaultMiddlewaresContext;
