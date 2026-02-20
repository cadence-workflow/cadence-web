import {
  type WorkflowHistoryGroupFilterConfig,
  type WorkflowHistoryGroupFilterType,
} from '../workflow-history-filters-menu/workflow-history-filters-menu.types';

const workflowHistoryGroupFilterTypeConfig: Record<
  WorkflowHistoryGroupFilterType,
  WorkflowHistoryGroupFilterConfig
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

export default workflowHistoryGroupFilterTypeConfig;
