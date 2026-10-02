import { type BatchActionType } from '@/route-handlers/describe-batch-action/describe-batch-action.types';
import { type SignalWorkflowSubmissionData } from '@/views/workflow-actions/workflow-action-signal-form/workflow-action-signal-form.types';

import {
  type BatchActionConfirmPayload,
  type BatchActionModalConfig,
} from '../domain-batch-actions.types';

export type Props = {
  config: Partial<Record<BatchActionType, BatchActionModalConfig<any, any>>>;
  actionId: BatchActionType | null;
  selectedCount: number;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (
    payload: BatchActionConfirmPayload<SignalWorkflowSubmissionData | undefined>
  ) => void;
};
