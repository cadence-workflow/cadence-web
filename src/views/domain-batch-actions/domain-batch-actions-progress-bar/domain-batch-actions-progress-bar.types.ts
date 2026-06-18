import {
  type BatchActionProgress,
  type BatchActionType,
} from '@/route-handlers/describe-batch-action/describe-batch-action.types';
import { type BatchActionStatus } from '@/route-handlers/list-batch-actions/list-batch-actions.types';

export type Props = {
  status: BatchActionStatus;
  progress?: BatchActionProgress;
  actionType?: BatchActionType;
};
