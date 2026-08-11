import { type HistoryEventFilterStatus } from './workflow-history-filters-status.types';

export const HISTORY_EVENT_FILTER_STATUSES = {
  PENDING: 'PENDING',
  CANCELED: 'CANCELED',
  FAILED: 'FAILED',
  COMPLETED: 'COMPLETED',
} as const satisfies Record<HistoryEventFilterStatus, string>;

export const HISTORY_EVENT_FILTER_STATUS_LABELS_MAP = {
  PENDING: 'Pending',
  CANCELED: 'Canceled',
  FAILED: 'Failed',
  COMPLETED: 'Completed',
} as const satisfies Record<HistoryEventFilterStatus, string>;
