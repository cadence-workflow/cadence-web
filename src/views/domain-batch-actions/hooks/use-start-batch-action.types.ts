import { type BatchActionType } from '@/route-handlers/describe-batch-action/describe-batch-action.types';
import { type SignalWorkflowSubmissionData } from '@/views/workflow-actions/workflow-action-signal-form/workflow-action-signal-form.types';

export type UseStartBatchActionParams = {
  cluster: string;
};

export type BuildBatchActionPayloadParams = {
  domain: string;
  query: string;
  reason: string;
  rps: number;
  batchType: BatchActionType;
  signalParams?: SignalWorkflowSubmissionData;
};

export type BatchActionPayload = {
  DomainName: string;
  Query: string;
  Reason: string;
  BatchType: BatchActionType;
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
