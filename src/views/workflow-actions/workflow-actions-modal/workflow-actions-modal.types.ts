import { type DefaultValues, type FieldValues } from 'react-hook-form';

import { type WorkflowAction } from '../workflow-actions.types';

export type Props<Result, FormData extends FieldValues, SubmissionData> = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
  action: WorkflowAction<Result, FormData, SubmissionData> | undefined;
  onClose: () => void;
  initialFormValues?: DefaultValues<FormData>;
};
