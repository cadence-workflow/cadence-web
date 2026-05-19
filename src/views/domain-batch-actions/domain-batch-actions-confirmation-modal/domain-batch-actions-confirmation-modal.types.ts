import { type FieldValues } from 'react-hook-form';

import { type BatchActionConfirmableType } from '../domain-batch-actions.types';

export type Props = {
  actionId: BatchActionConfirmableType | null;
  selectedCount: number;
  onClose: () => void;
  onConfirm: (
    actionId: BatchActionConfirmableType,
    formData?: FieldValues
  ) => void;
};
