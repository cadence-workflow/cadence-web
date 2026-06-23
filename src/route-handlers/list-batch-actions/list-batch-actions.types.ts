import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

export type BatchActionStatus = 'RUNNING' | 'COMPLETED' | 'ABORTED' | 'FAILED';

export type RouteParams = {
  domain: string;
  cluster: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type BatchActionListItem = {
  workflowId: string;
  runId: string;
  status: BatchActionStatus;
};

export type ListBatchActionsResponse = {
  batchActions: Array<BatchActionListItem>;
  nextPageToken: string;
};

export type Context = DefaultMiddlewaresContext;
