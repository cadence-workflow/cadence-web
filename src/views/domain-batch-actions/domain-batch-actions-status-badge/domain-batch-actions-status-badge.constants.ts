import { type BatchActionStatus } from '@/views/domain-batch-actions/domain-batch-actions.types';

export const BATCH_WORKFLOW_STATUS_LABELS: Record<BatchActionStatus, string> = {
  running: 'Processing',
  completed: 'Completed',
  aborted: 'Aborted',
  failed: 'Failed',
};
