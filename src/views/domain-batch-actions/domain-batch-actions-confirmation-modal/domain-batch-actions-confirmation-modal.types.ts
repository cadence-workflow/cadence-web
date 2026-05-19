import { type SignalWorkflowFormData } from '@/views/workflow-actions/workflow-action-signal-form/workflow-action-signal-form.types';

import { type BatchActionConfirmableType } from '../domain-batch-actions.types';

export type Props = {
  actionId: BatchActionConfirmableType | null;
  selectedCount: number;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (
    actionId: BatchActionConfirmableType,
    formData?: SignalWorkflowFormData
  ) => void;
};
