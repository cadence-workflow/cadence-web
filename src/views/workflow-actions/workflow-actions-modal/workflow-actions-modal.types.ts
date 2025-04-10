import { type FieldValues } from 'react-hook-form';

import { type WorkflowAction } from '../workflow-actions.types';

export type Props<FormData extends FieldValues, SubmissionData, Result> = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
  action: WorkflowAction<FormData, SubmissionData, Result> | undefined;
  onClose: () => void;
};
