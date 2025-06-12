import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import { type WorkflowEventStatus } from '../workflow-history-event-status-badge/workflow-history-event-status-badge.types';
import {
  type PendingActivityTaskStartEvent,
  type PendingDecisionTaskStartEvent,
} from '../workflow-history.types';

export type WorkflowHistoryUngroupedEventCardDetails = {
  label: string;
  id: string;
  status: WorkflowEventStatus;
  statusLabel: string;
  event:
    | HistoryEvent
    | PendingDecisionTaskStartEvent
    | PendingActivityTaskStartEvent;
};
