import { type WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';

export type Props = {
  startTime: number | null | undefined;
  closeTime: number | null | undefined;
  workflowIsArchived: boolean;
  workflowCloseStatus: WorkflowExecutionCloseStatus | null | undefined;
  eventsCount: number;
  loadingMoreEvents: boolean;
  hasMissingEvents: boolean;
  workflowCloseTime: number | null | undefined;
};
