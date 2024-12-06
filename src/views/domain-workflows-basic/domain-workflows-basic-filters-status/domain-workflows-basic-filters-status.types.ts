import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

export type WorkflowStatusBasicVisibility = WorkflowStatus | 'ALL_CLOSED';

export type DomainWorkflowsBasicFiltersStatusValue = {
  statusBasic: WorkflowStatusBasicVisibility | undefined;
};
