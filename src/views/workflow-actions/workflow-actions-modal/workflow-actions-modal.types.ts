import { type DefaultValues } from 'react-hook-form';

import { type WorkflowAction } from '../workflow-actions.types';

export type Props<Result, FormData, SubmissionData> = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
  action: WorkflowAction<Result, FormData, SubmissionData> | undefined;
  onClose: () => void;
  initialFormValues?: DefaultValues<FormData>;
};
