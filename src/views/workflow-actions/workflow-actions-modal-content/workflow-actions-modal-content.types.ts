import { type DefaultValues } from 'react-hook-form';

import {
  type WorkflowAction,
  type WorkflowActionInputParams,
} from '../workflow-actions.types';

export type Props<Result, FormData, SubmissionData> = {
  action: WorkflowAction<Result, FormData, SubmissionData>;
  params: WorkflowActionInputParams;
  onCloseModal: () => void;
  initialFormValues?: DefaultValues<FormData>;
};
