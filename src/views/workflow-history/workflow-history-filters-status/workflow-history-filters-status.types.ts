export type HistoryEventFilterStatus =
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELED'
  | 'PENDING';

export type WorkflowHistoryFiltersStatusValue = {
  historyEventStatuses: HistoryEventFilterStatus[] | undefined;
};
