import { type BatchActionConfirmableType } from '../domain-batch-actions.types';

export type Props = {
  actionId: BatchActionConfirmableType | null;
  selectedCount: number;
  onClose: () => void;
  onConfirm: (
    actionId: BatchActionConfirmableType,
    submissionData?: unknown
  ) => void;
};
