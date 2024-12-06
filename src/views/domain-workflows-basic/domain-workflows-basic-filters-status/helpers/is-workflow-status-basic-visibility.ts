import { WORKFLOW_STATUS_NAMES_BASIC_VISIBILITY } from '../domain-workflows-basic-filters-status.constants';
import { type WorkflowStatusBasicVisibility } from '../domain-workflows-basic-filters-status.types';

export default function isWorkflowStatusBasicVisibility(
  value: any
): value is WorkflowStatusBasicVisibility {
  return value in WORKFLOW_STATUS_NAMES_BASIC_VISIBILITY;
}
