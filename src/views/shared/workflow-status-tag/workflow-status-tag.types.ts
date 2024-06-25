import { type WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';

export type WorkflowStatus = WorkflowExecutionCloseStatus;

export type Props = {
  status: WorkflowStatus;
  link?: string;
};

export type OverridesArgs = {
  status: WorkflowStatus;
  link?: string;
};
