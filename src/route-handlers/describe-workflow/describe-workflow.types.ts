import { type WorkflowExecutionInfo } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionInfo';

export type RouteParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type DescribeWorkflowResponse = WorkflowExecutionInfo;
