import { type RouteParams as ListWorkflowsBasicRouteParams } from '@/route-handlers/list-workflows-basic/list-workflows-basic.types';

export type UseListWorkflowsBasicParams = ListWorkflowsBasicRouteParams & {
  pageSize?: number;
};
