import { type BatchActionType } from './describe-batch-action.types';

export const BATCH_ACTION_TYPE = {
  cancel: 'cancel',
  terminate: 'terminate',
  reset: 'reset',
  signal: 'signal',
} as const satisfies Record<BatchActionType, BatchActionType>;
