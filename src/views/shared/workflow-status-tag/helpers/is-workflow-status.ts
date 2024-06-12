import { WORKFLOW_STATUS_NAMES } from '../workflow-status-tag.constants';
import { type WorkflowStatus } from '../workflow-status-tag.types';

export default function isWorkflowStatus(value: any): value is WorkflowStatus {
  return value in WORKFLOW_STATUS_NAMES;
}
