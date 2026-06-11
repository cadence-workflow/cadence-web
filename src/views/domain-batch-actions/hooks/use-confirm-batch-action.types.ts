import { type BatchActionType } from '@/route-handlers/describe-batch-action/describe-batch-action.types';
import { type SignalWorkflowSubmissionData } from '@/views/workflow-actions/workflow-action-signal-form/workflow-action-signal-form.types';

export type UseConfirmBatchActionParams = {
  domain: string;
  cluster: string;
  onSuccess?: () => void;
};

export type ConfirmBatchActionInput = {
  batchType: BatchActionType;
  query: string;
  reason: string;
  rps: number;
  signalParams?: SignalWorkflowSubmissionData;
};

export type ConfirmBatchActionHandler = (
  input: ConfirmBatchActionInput
) => void;
