import { type WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';

export type Props = {
  startTime: Date | string | number;
  closeTime: Date | string | number | null | undefined;
  workflowIsArchived: boolean;
  workflowCloseStatus: WorkflowExecutionCloseStatus | null | undefined;
  eventsCount: number;
  loadingMoreEvents: boolean;
  hasMissingEvents: boolean;
  workflowCloseTime: Date | string | number | null | undefined;
  showOngoingOnly?: boolean;
};
