import { type DefaultValues, type FieldValues } from 'react-hook-form';

import {
  type WorkflowAction,
  type WorkflowActionInputParams,
} from '../workflow-actions.types';

export type Props<Result, FormData extends FieldValues, SubmissionData> = {
  action: WorkflowAction<Result, FormData, SubmissionData>;
  params: WorkflowActionInputParams;
  onCloseModal: () => void;
  initialFormValues?: DefaultValues<FormData>;
};
