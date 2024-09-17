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
