export type WorkflowStatus =
  | 'running'
  | 'completed'
  | 'failed'
  | 'canceled'
  | 'terminated'
  | 'continuedAsNew'
  | 'timedOut'
  | 'unknown';

export type Props = {
  status: WorkflowStatus;
  link?: string;
};

export type OverridesArgs = {
  status: WorkflowStatus;
  link?: string;
};
