import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

export type Props = {
  domain: string;
  cluster: string;
};

export type WorkflowStatusClosed = Exclude<
  WorkflowStatus,
  'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID'
>;
