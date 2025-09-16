import {
  type WorkflowHistoryEventFilteringConfig,
  type WorkflowHistoryEventFilteringType,
} from '../workflow-history-filters-type/workflow-history-filters-type.types';

const workflowHistoryFiltersTypeConfig: Record<
  WorkflowHistoryEventFilteringType,
  WorkflowHistoryEventFilteringConfig
> = {
  ACTIVITY: 'Activity',
  CHILDWORKFLOW: 'ChildWorkflowExecution',
  DECISION: 'Decision',
  TIMER: 'Timer',
  SIGNAL: (g) =>
    g.groupType === 'SignalExternalWorkflowExecution' ||
    (g.events.length > 0 &&
      g.events[0].attributes === 'workflowExecutionSignaledEventAttributes'),
  WORKFLOW: (g) =>
    g.groupType === 'RequestCancelExternalWorkflowExecution' ||
    (g.groupType === 'Event' &&
      g.events.length > 0 &&
      g.events[0].attributes !== 'workflowExecutionSignaledEventAttributes'),
};

export default workflowHistoryFiltersTypeConfig;
