export type WorkflowHistoryEventFilteringType =
  | 'DECISION'
  | 'ACTIVITY'
  | 'SIGNAL'
  | 'TIMER'
  | 'DECISION'
  | 'CHILDWORKFLOW'
  | 'WORKFLOW';

export type WorkflowHistoryFiltersTypeValue = {
  historyEventTypes: WorkflowHistoryEventFilteringType[] | undefined;
};
