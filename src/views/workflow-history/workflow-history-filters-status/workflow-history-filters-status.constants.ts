import { WORKFLOW_EVENT_STATUS } from '../workflow-history-event-status-badge/workflow-history-event-status-badge.constants';
import { type WorkflowEventStatus } from '../workflow-history-event-status-badge/workflow-history-event-status-badge.types';

export const WORKFLOW_HISTORY_EVENT_FILTERING_STATUS_OPTIONS = [
  {
    label: 'On Going',
    id: WORKFLOW_EVENT_STATUS.ONGOING,
  },

  {
    label: 'Waiting',
    id: WORKFLOW_EVENT_STATUS.WAITING,
  },
  {
    label: 'Canceled',
    id: WORKFLOW_EVENT_STATUS.CANCELED,
  },
  {
    label: 'Failed',
    id: WORKFLOW_EVENT_STATUS.FAILED,
  },
  {
    label: 'Completed',
    id: WORKFLOW_EVENT_STATUS.COMPLETED,
  },
] as const satisfies {
  id: WorkflowEventStatus;
  label: string;
}[];
