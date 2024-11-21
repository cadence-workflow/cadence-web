import {
  type RouteParams as ListWorkflowsRouteParams,
  type ListWorkflowsRequestQueryParams,
} from '@/route-handlers/list-workflows/list-workflows.types';

export type UseListWorkflowsParams = ListWorkflowsRouteParams &
  Omit<ListWorkflowsRequestQueryParams, 'pageSize'> & { pageSize?: number };
