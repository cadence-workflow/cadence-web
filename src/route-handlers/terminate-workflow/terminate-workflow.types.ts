import { type TerminateWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/TerminateWorkflowExecutionResponse';
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

export type TerminateWorkflowResponse = TerminateWorkflowExecutionResponse;

export type Context = DefaultMiddlewaresContext;
