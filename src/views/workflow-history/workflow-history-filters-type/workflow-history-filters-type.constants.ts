import { type ExtendedHistoryEvent } from '../workflow-history.types';

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

export const WORKFLOW_HISTORY_EVENT_FILTERING_TYPE_TO_ATTRS_MAP: Record<
  WorkflowHistoryEventFilteringType,
  ExtendedHistoryEvent['attributes'][]
> = {
  ACTIVITY: [
    'activityTaskScheduledEventAttributes',
    'pendingActivityTaskStartEventAttributes',
    'activityTaskStartedEventAttributes',
    'activityTaskCompletedEventAttributes',
    'activityTaskFailedEventAttributes',
    'activityTaskTimedOutEventAttributes',
    'activityTaskCanceledEventAttributes',
    'activityTaskCancelRequestedEventAttributes',
    'requestCancelActivityTaskFailedEventAttributes',
  ],
  DECISION: [
    'pendingDecisionTaskStartEventAttributes',
    'decisionTaskScheduledEventAttributes',
    'decisionTaskStartedEventAttributes',
    'decisionTaskCompletedEventAttributes',
    'decisionTaskFailedEventAttributes',
    'decisionTaskTimedOutEventAttributes',
  ],
  TIMER: [
    'timerStartedEventAttributes',
    'timerFiredEventAttributes',
    'timerCanceledEventAttributes',
    'cancelTimerFailedEventAttributes',
  ],
  CHILDWORKFLOW: [
    'startChildWorkflowExecutionInitiatedEventAttributes',
    'startChildWorkflowExecutionFailedEventAttributes',
    'childWorkflowExecutionStartedEventAttributes',
    'childWorkflowExecutionCompletedEventAttributes',
    'childWorkflowExecutionFailedEventAttributes',
    'childWorkflowExecutionCanceledEventAttributes',
    'childWorkflowExecutionTimedOutEventAttributes',
    'childWorkflowExecutionTerminatedEventAttributes',
  ],
  SIGNAL: [
    'signalExternalWorkflowExecutionInitiatedEventAttributes',
    'signalExternalWorkflowExecutionFailedEventAttributes',
    'externalWorkflowExecutionSignaledEventAttributes',
    'workflowExecutionSignaledEventAttributes',
  ],
  WORKFLOW: [
    'requestCancelExternalWorkflowExecutionInitiatedEventAttributes',
    'requestCancelExternalWorkflowExecutionFailedEventAttributes',
    'externalWorkflowExecutionCancelRequestedEventAttributes',
    'workflowExecutionStartedEventAttributes',
    'workflowExecutionCompletedEventAttributes',
    'workflowExecutionFailedEventAttributes',
    'workflowExecutionTimedOutEventAttributes',
    'markerRecordedEventAttributes',
    'workflowExecutionTerminatedEventAttributes',
    'workflowExecutionCancelRequestedEventAttributes',
    'workflowExecutionCanceledEventAttributes',
    'workflowExecutionContinuedAsNewEventAttributes',
    'upsertWorkflowSearchAttributesEventAttributes',
  ],
};
