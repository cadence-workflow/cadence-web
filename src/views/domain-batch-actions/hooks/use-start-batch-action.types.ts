import { type SignalWorkflowFormData } from '@/views/workflow-actions/workflow-action-signal-form/workflow-action-signal-form.types';

import { type BatchActionConfirmableType } from '../domain-batch-actions.types';

export type UseStartBatchActionParams = {
  cluster: string;
};

export type BuildBatchActionPayloadParams = {
  domain: string;
  query: string;
  reason: string;
  rps: number;
  batchType: BatchActionConfirmableType;
  signalParams?: SignalWorkflowFormData;
};

export type BatchActionPayload = {
  DomainName: string;
  Query: string;
  Reason: string;
  BatchType: BatchActionConfirmableType;
  RPS: number;
  SignalParams?: {
    SignalName: string;
    Input: string;
  };
};

export type StartBatchActionResponse = {
  workflowId: string;
  runId: string;
};
