import { type BatchActionConfirmPayload } from '../config/domain-batch-actions-confirmation-modal.config';
import { type BatchActionConfirmableType } from '../domain-batch-actions.types';

export type Props = {
  actionId: BatchActionConfirmableType | null;
  selectedCount: number;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (payload: BatchActionConfirmPayload) => void;
};
