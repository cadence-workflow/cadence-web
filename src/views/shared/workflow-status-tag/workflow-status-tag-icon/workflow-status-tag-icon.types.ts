import { WorkflowStatus } from '../workflow-status-tag.types';

export type WorkflowStatusTagIconKind = 'start' | 'end';

export type Props = {
  kind: WorkflowStatusTagIconKind;
  status: WorkflowStatus;
  link?: string;
};
