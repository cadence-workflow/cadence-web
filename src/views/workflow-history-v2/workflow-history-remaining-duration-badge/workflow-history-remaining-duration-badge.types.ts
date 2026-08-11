import { type WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';

export type Props = {
  startTime: Date | string | number;
  expectedEndTime: number;
  prefix: string;
  workflowIsArchived: boolean;
  workflowCloseStatus: WorkflowExecutionCloseStatus | null | undefined;
  loadingMoreEvents: boolean;
};
