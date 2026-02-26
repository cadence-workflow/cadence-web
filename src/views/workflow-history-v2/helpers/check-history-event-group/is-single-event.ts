import type { SingleHistoryEvent } from '../../workflow-history-v2.types';

import isLocalActivityEvent from './is-local-activity-event';

export default function isSingleEvent(event: {
  attributes: string;
  markerRecordedEventAttributes?: {
    markerName?: string;
  } | null;
}): event is SingleHistoryEvent {
  // Local activity events are marker events but should be handled separately
  if (isLocalActivityEvent(event)) {
    return false;
  }

  return [
    'activityTaskCancelRequestedEventAttributes',
    'requestCancelActivityTaskFailedEventAttributes',
    'cancelTimerFailedEventAttributes',
    'markerRecordedEventAttributes',
    'upsertWorkflowSearchAttributesEventAttributes',
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
