import { type WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';
import { type HistoryEventsGroup } from '@/views/workflow-history/workflow-history.types';

export type Props = {
  startTime: number | null | undefined;
  closeTime: number | null | undefined;
  expectedEndTimeInfo?: HistoryEventsGroup['expectedEndTimeInfo'];
  workflowIsArchived: boolean;
  workflowCloseStatus: WorkflowExecutionCloseStatus | null | undefined;
  eventsCount: number;
  loadingMoreEvents: boolean;
  hasMissingEvents: boolean;
  workflowCloseTime: number | null | undefined;
};
