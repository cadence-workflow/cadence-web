import { type SignalWorkflowFormData } from '@/views/workflow-actions/workflow-action-signal-form/workflow-action-signal-form.types';

import { type BatchActionConfirmableType } from '../domain-batch-actions.types';

export type UseConfirmBatchActionParams = {
  domain: string;
  cluster: string;
  onSuccess?: () => void;
};

export type ConfirmBatchActionInput = {
  batchType: BatchActionConfirmableType;
  query: string;
  reason: string;
  rps: number;
  signalParams?: SignalWorkflowFormData;
};

export type ConfirmBatchActionHandler = (
  input: ConfirmBatchActionInput
) => void;
