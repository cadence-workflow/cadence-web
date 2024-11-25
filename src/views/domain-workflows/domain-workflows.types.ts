import { type RouteParams as ListWorkflowsRouteParams } from '@/route-handlers/list-workflows/list-workflows.types';

export type UseListWorkflowsParams = ListWorkflowsRouteParams & {
  pageSize?: number;
};
