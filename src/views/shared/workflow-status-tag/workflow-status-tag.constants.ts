import type { WorkflowStatus, Props } from './workflow-status-tag.types';

export const WORKFLOW_STATUS_NAMES: Record<WorkflowStatus, string> = {
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  canceled: 'Canceled',
  terminated: 'Terminated',
  continuedAsNew: 'Continued As New',
  timedOut: 'Timed Out',
  unknown: 'Unknown',
};
