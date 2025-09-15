import { type WorkflowHistoryEventFilteringType } from './workflow-history-filters-type.types';

export const WORKFLOW_HISTORY_EVENT_FILTERING_TYPES: WorkflowHistoryEventFilteringType[] =
  ['ACTIVITY', 'CHILDWORKFLOW', 'DECISION', 'SIGNAL', 'TIMER', 'WORKFLOW'];

export const WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_LABEL_MAP = {
  DECISION: 'Decision',
  ACTIVITY: 'Activity',
  SIGNAL: 'Signal',
  TIMER: 'Timer',
  WORKFLOW: 'Workflow',
  CHILDWORKFLOW: 'Child Workflow',
} as const satisfies Record<WorkflowHistoryEventFilteringType, string>;
