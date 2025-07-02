import { type HistoryEventsGroup } from '../../workflow-history.types';
import {
  type WorkflowHistoryEventFilteringType,
  type WorkflowHistoryFiltersTypeValue,
} from '../workflow-history-filters-type.types';

const filterEventsByEventType = function (
  group: HistoryEventsGroup,
  value: WorkflowHistoryFiltersTypeValue
) {
  const groupType = group.groupType;

  let eventTypeToSearchFor: WorkflowHistoryEventFilteringType | undefined =
    undefined;

  switch (groupType) {
    case 'Activity':
      eventTypeToSearchFor = 'ACTIVITY';
    case 'ChildWorkflowExecution':
      eventTypeToSearchFor = 'CHILDWORKFLOW';
    case 'Decision':
      eventTypeToSearchFor = 'DECISION';
    case 'SignalExternalWorkflowExecution':
      eventTypeToSearchFor = 'SIGNAL';
    case 'Timer':
      eventTypeToSearchFor = 'TIMER';
    case 'RequestCancelExternalWorkflowExecution':
    case 'Event':
      eventTypeToSearchFor = 'WORKFLOW';
  }

  return value.historyEventTypes?.includes(eventTypeToSearchFor) ?? false;
};

export default filterEventsByEventType;
