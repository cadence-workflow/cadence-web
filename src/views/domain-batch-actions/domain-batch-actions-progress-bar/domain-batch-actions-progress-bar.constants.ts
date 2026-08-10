import { type BatchActionType } from '@/route-handlers/describe-batch-action/describe-batch-action.types';

export const BATCH_ACTION_PROGRESS_VERB: Record<BatchActionType, string> = {
  cancel: 'Cancelled',
  terminate: 'Terminated',
  signal: 'Signaled',
};

export const DEFAULT_BATCH_ACTION_PROGRESS_VERB = 'Processed';
