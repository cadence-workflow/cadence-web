import { type RouteParams as ListWorkflowsRouteParams } from '@/route-handlers/list-workflows/list-workflows.types';
import { type SortOrder } from '@/utils/sort-by';

import { type WorkflowStatus } from '../workflow-status-tag/workflow-status-tag.types';
import { type WorkflowsHeaderInputType } from '../workflows-header/workflows-header.types';

export type UseListWorkflowsParams = ListWorkflowsRouteParams & {
  pageSize: number;
  inputType: WorkflowsHeaderInputType;
  search?: string;
  status?: WorkflowStatus;
  timeRangeStart?: Date;
  timeRangeEnd?: Date;
  sortColumn: string;
  sortOrder: SortOrder;
  query: string;
};
