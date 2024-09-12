import type {
  WorkflowEventStatus,
  WorkflowEventStatusBadgeSize,
} from './workflow-history-event-status-badge.types';

export const WORKFLOW_EVENT_STATUS = {
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELED: 'CANCELED',
  ONGOING: 'ONGOING',
  WAITING: 'WAITING',
} as const satisfies Record<WorkflowEventStatus, WorkflowEventStatus>;

export const WORKFLOW_EVENT_STATUS_BADGE_SIZES: Record<
  WorkflowEventStatusBadgeSize,
  WorkflowEventStatusBadgeSize
> = {
  small: 'small',
  medium: 'medium',
};
