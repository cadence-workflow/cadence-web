import { type RouteParams as ListWorkflowsRouteParams } from '@/route-handlers/list-workflows/list-workflows.types';

import { type WorkflowsFiltersValues } from '../shared/workflows-header/workflows-header.types';

export type UseListWorkflowsParams = ListWorkflowsRouteParams & {
  filtersValues: WorkflowsFiltersValues;
  pageSize?: number;
  isArchival?: boolean;
};
