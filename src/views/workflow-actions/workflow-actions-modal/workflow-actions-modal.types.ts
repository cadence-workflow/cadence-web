import { type WorkflowAction } from '../workflow-actions.types';

export type Props<FormData, SubmissionData, Result> = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
  action: WorkflowAction<FormData, SubmissionData, Result> | undefined;
  onClose: () => void;
};
