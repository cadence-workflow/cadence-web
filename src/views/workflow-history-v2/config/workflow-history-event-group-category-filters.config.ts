import {
  type EventGroupCategoryConfig,
  type EventGroupCategory,
} from '../workflow-history-filters-menu/workflow-history-filters-menu.types';

const workflowHistoryEventGroupCategoryFiltersConfig: Record<
  EventGroupCategory,
  EventGroupCategoryConfig
> = {
  ACTIVITY: 'Activity',
  CHILDWORKFLOW: 'ChildWorkflowExecution',
  DECISION: 'Decision',
  TIMER: 'Timer',
  SIGNAL: (g) =>
    g.groupType === 'SignalExternalWorkflowExecution' ||
    g.groupType === 'WorkflowSignaled',
  WORKFLOW: (g) =>
    g.groupType === 'RequestCancelExternalWorkflowExecution' ||
    g.groupType === 'Event',
};

export default workflowHistoryEventGroupCategoryFiltersConfig;
