export type WokflowHistoryEventFilteringType =
  | 'DECISION'
  | 'ACTIVITY'
  | 'SIGNAL'
  | 'TIMER'
  | 'DECISION'
  | 'CHILDWORKFLOW'
  | 'WORKFLOW';

export type WorkflowHistoryFiltersTypeValue = {
  historyEventType: WokflowHistoryEventFilteringType | undefined;
};
