import {
  type WorkflowAction,
  type WorkflowActionInputParams,
} from '../workflow-actions.types';

export type Props<R> = {
  action: WorkflowAction<R>;
  params: WorkflowActionInputParams;
  onCloseModal: () => void;
};
