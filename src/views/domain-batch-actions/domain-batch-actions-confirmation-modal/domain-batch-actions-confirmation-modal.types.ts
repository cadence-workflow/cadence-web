import { type BatchActionType } from '@/route-handlers/describe-batch-action/describe-batch-action.types';

import {
  type BatchActionConfirmPayload,
  type BatchActionsConfirmationModalConfig,
} from '../domain-batch-actions.types';

export type Props = {
  config: BatchActionsConfirmationModalConfig;
  actionId: BatchActionType | null;
  selectedCount: number;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (payload: BatchActionConfirmPayload) => void;
};
