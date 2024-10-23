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

export type FetchWorkflowQueryTypesResponse = {
  queryTypes: Array<string>;
};

export type Context = DefaultMiddlewaresContext;
