import type { SingleHistoryEvent } from '../../workflow-history.types';

export default function isSingleEvent(event: {
  attributes: string;
}): event is SingleHistoryEvent {
  return [
    'activityTaskCancelRequestedEventAttributes',
    'requestCancelActivityTaskFailedEventAttributes',
    'cancelTimerFailedEventAttributes',
    'markerRecordedEventAttributes',
    'upsertWorkflowSearchAttributesEventAttributes',
    'workflowExecutionSignaledEventAttributes',
    'workflowExecutionStartedEventAttributes',
    'workflowExecutionCompletedEventAttributes',
    'workflowExecutionFailedEventAttributes',
    'workflowExecutionTimedOutEventAttributes',
    'workflowExecutionTerminatedEventAttributes',
    'workflowExecutionCancelRequestedEventAttributes',
    'workflowExecutionCanceledEventAttributes',
    'workflowExecutionContinuedAsNewEventAttributes',
  ].includes(event?.attributes);
}
