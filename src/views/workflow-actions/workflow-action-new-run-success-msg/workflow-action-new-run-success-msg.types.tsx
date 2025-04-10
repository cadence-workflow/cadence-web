import { type WorkflowActionSuccessMessageProps } from '../workflow-actions.types';

export type Props = WorkflowActionSuccessMessageProps<{ runId: string }> & {
  successMessage: string;
};
