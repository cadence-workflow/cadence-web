import { type WorkflowAction } from '../workflow-actions.types';

export type Props<R> = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
  action: WorkflowAction<R> | undefined;
  onClose: () => void;
};
