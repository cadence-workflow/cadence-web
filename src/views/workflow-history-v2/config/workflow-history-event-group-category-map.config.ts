import { type EventGroupTypeToCategoryConfig } from '../workflow-history-filters-menu/workflow-history-filters-menu.types';
import { type HistoryEventGroupType } from '../workflow-history-v2.types';

const workflowHistoryEventGroupTypeToCategoryConfig = {
  Activity: 'ACTIVITY',
  LocalActivity: 'ACTIVITY',
  ChildWorkflowExecution: 'CHILDWORKFLOW',
  Decision: 'DECISION',
  SignalExternalWorkflowExecution: 'SIGNAL',
  WorkflowSignaled: 'SIGNAL',
  Timer: 'TIMER',
  RequestCancelExternalWorkflowExecution: 'WORKFLOW',
  Event: 'WORKFLOW',
} as const satisfies Record<
  HistoryEventGroupType,
  EventGroupTypeToCategoryConfig
>;

export default workflowHistoryEventGroupTypeToCategoryConfig;
