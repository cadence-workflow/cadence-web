import { type RouteParams as ListBatchActionsRouteParams } from '@/route-handlers/list-batch-actions/list-batch-actions.types';

export type UseListBatchActionsParams = ListBatchActionsRouteParams & {
  pageSize: number;
};
