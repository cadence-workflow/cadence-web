export type WorkflowEventStatusBadgeSize = 'small' | 'medium';
export type WorkflowEventStatus =
  | 'ONGOING'
  | 'WAITING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELED';

export type Props = {
  status: WorkflowEventStatus;
  statusReady: boolean;
  size?: WorkflowEventStatusBadgeSize;
};
