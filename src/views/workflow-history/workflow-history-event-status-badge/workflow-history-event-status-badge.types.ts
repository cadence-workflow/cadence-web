export type WorkflowEventStatusBadgeSize = 'small' | 'medium';
export type WorkflowEventStatus =
  | 'ONGOING'
  | 'WAITING'
  | 'COMPLETED'
  | 'FAILED';

export type Props = {
  status: WorkflowEventStatus;
  size?: WorkflowEventStatusBadgeSize;
};
