import {
  type HistoryEventGroupType,
  type HistoryEventsGroup,
} from '../workflow-history.types';

// TODO @adhitya.mamallan - rename these to WorkflowHistoryGroupFilteringType
// These filters are for history event groups
export type WorkflowHistoryEventFilteringType =
  | 'DECISION'
  | 'ACTIVITY'
  | 'SIGNAL'
  | 'TIMER'
  | 'CHILDWORKFLOW'
  | 'WORKFLOW';

export type WorkflowHistoryFiltersTypeValue = {
  historyEventTypes: WorkflowHistoryEventFilteringType[] | undefined;
};

export type WorkflowHistoryEventFilteringConfig =
  | HistoryEventGroupType
  | ((g: HistoryEventsGroup) => boolean);
