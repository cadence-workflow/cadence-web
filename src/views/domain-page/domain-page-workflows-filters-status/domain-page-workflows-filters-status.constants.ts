import { WORKFLOW_STATUS_NAMES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

export const WORKFLOW_STATUS_OPTIONS = Object.entries(
  WORKFLOW_STATUS_NAMES
).map(([key, value]) => ({
  id: key,
  label: value,
}));
