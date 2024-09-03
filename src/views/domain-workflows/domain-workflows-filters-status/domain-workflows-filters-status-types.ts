import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

export type DomainWorkflowsFiltersStatusValue = {
  status: WorkflowStatus | undefined;
};
