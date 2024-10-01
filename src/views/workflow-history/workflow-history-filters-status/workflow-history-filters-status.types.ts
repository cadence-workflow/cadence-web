import { type WorkflowEventStatus } from '../workflow-history-event-status-badge/workflow-history-event-status-badge.types';

export type WorkflowHistoryFiltersStatusValue = {
  historyEventStatus: WorkflowEventStatus | undefined;
};
