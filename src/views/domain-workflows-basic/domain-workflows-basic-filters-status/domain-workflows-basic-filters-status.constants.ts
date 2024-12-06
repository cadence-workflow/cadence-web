import { WORKFLOW_STATUS_NAMES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import { type WorkflowStatusBasicVisibility } from './domain-workflows-basic-filters-status.types';

export const WORKFLOW_STATUS_NAMES_BASIC_VISIBILITY = {
  ALL_CLOSED: 'Closed',
  ...WORKFLOW_STATUS_NAMES,
} as const satisfies Record<WorkflowStatusBasicVisibility, string>;

export const WORKFLOW_STATUS_OPTIONS_BASIC_VISIBILITY = Object.entries(
  WORKFLOW_STATUS_NAMES_BASIC_VISIBILITY
).map(([key, value]) => ({
  id: key,
  label: value,
}));
