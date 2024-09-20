import { type QueryRejected } from '@/__generated__/proto-ts/uber/cadence/api/v1/QueryRejected';

export type RouteParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
  queryName: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type QueryWorkflowResponse = {
  result: any;
  rejected: QueryRejected | null;
};
