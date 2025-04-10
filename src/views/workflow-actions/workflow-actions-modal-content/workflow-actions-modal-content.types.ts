import {
  type WorkflowAction,
  type WorkflowActionInputParams,
} from '../workflow-actions.types';

export type Props<FormData, SubmissionData, Result> = {
  action: WorkflowAction<FormData, SubmissionData, Result>;
  params: WorkflowActionInputParams;
  onCloseModal: () => void;
};
