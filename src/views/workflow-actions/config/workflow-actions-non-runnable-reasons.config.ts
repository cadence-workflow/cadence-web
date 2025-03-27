import { type WorkflowActionNonRunnableStatus } from '../workflow-actions.types';

const WORKFLOW_ACTIONS_NON_RUNNABLE_REASONS_CONFIG = {
  NOT_RUNNABLE_WORKFLOW_CLOSED: 'Workflow is already closed',
} as const satisfies Record<WorkflowActionNonRunnableStatus, string>;

export default WORKFLOW_ACTIONS_NON_RUNNABLE_REASONS_CONFIG;
