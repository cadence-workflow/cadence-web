import { type WorkflowActionSuccessMessageProps } from '../workflow-actions.types';

export type Props = WorkflowActionSuccessMessageProps<
  any,
  { runId: string }
> & {
  successMessage: string;
};
