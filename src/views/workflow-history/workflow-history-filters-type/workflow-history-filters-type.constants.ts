import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import { type WokflowHistoryEventFilteringType } from './workflow-history-filters-type.types';

export const WORKFLOW_HISTORY_EVENT_FILTERING_TYPES: WokflowHistoryEventFilteringType[] =
  ['ACTIVITY', 'CHILDWORKFLOW', 'DECISION', 'SIGNAL', 'TIMER', 'WORKFLOW'];

export const WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_OPTIONS = [
  {
    label: 'Decision',
    id: 'DECISION',
  },
  {
    label: 'Activity',
    id: 'ACTIVITY',
  },
  {
    label: 'Signal',
    id: 'SIGNAL',
  },
  {
    label: 'Timer',
    id: 'TIMER',
  },
  {
    label: 'Child Workflow',
    id: 'CHILDWORKFLOW',
  },
  {
    label: 'Workflow',
    id: 'WORKFLOW',
  },
] as const satisfies {
  id: WokflowHistoryEventFilteringType;
  label: string;
}[];

export const WORKFLOW_HISTORY_EVENT_FILTERING_TYPE_TO_ATTRS_MAP: Record<
  WokflowHistoryEventFilteringType,
  HistoryEvent['attributes'][]
> = {
  ACTIVITY: [
    'activityTaskScheduledEventAttributes',
    'activityTaskStartedEventAttributes',
    'activityTaskCompletedEventAttributes',
    'activityTaskFailedEventAttributes',
    'activityTaskTimedOutEventAttributes',
    'activityTaskCanceledEventAttributes',
    'activityTaskCancelRequestedEventAttributes',
    'requestCancelActivityTaskFailedEventAttributes',
  ],
  DECISION: [
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
