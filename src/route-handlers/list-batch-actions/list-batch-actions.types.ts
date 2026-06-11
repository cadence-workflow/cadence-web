import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

export type BatchActionStatus = 'RUNNING' | 'COMPLETED' | 'ABORTED' | 'FAILED';

export type RouteParams = {
  domain: string;
  cluster: string;
};

export type RequestParams = {
  params: RouteParams;
};

// Slim shape returned by the sidebar list endpoint. The full BatchAction
// (with actionType, rps, etc.) is only available via a per-row
// describe call planned for a follow-up PR.
export type BatchActionListItem = {
  id: string;
  status: BatchActionStatus;
};

export type ListBatchActionsResponse = {
  batchActions: Array<BatchActionListItem>;
  nextPageToken: string;
};

export type Context = DefaultMiddlewaresContext;
