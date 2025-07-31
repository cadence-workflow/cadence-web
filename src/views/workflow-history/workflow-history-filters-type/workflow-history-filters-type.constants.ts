import { type HistoryEventsGroup } from '../workflow-history.types';

import { type WorkflowHistoryEventFilteringType } from './workflow-history-filters-type.types';

export const WORKFLOW_HISTORY_EVENT_FILTERING_TYPES: WorkflowHistoryEventFilteringType[] =
  ['ACTIVITY', 'CHILDWORKFLOW', 'DECISION', 'SIGNAL', 'TIMER', 'WORKFLOW'];

export const DEFAULT_EVENT_FILTERING_TYPES: WorkflowHistoryEventFilteringType[] =
  ['ACTIVITY', 'CHILDWORKFLOW', 'SIGNAL', 'TIMER', 'WORKFLOW'];

export const WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_LABEL_MAP = {
  DECISION: 'Decision',
  ACTIVITY: 'Activity',
  SIGNAL: 'Signal',
  TIMER: 'Timer',
  WORKFLOW: 'Workflow',
  CHILDWORKFLOW: 'Child Workflow',
} as const satisfies Record<WorkflowHistoryEventFilteringType, string>;

export const WORKFLOW_HISTORY_GROUP_TYPE_TO_FILTERING_TYPE: Record<
  HistoryEventsGroup['groupType'],
  WorkflowHistoryEventFilteringType
> = {
  Activity: 'ACTIVITY',
  ChildWorkflowExecution: 'CHILDWORKFLOW',
  Decision: 'DECISION',
  SignalExternalWorkflowExecution: 'SIGNAL',
  Timer: 'TIMER',
  RequestCancelExternalWorkflowExecution: 'WORKFLOW',
  Event: 'WORKFLOW',
} as const;
