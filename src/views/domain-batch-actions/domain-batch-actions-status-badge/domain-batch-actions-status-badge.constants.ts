import { type BatchActionStatus } from '@/route-handlers/list-batch-actions/list-batch-actions.types';

export const BATCH_WORKFLOW_STATUS_LABELS: Record<BatchActionStatus, string> = {
  RUNNING: 'Processing',
  COMPLETED: 'Completed',
  ABORTED: 'Aborted',
  FAILED: 'Failed',
};
