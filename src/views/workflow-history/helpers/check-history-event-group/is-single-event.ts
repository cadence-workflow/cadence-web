import type { HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import type { SingleHistoryEvent } from '../../workflow-history.types';

export default function isSingleEvent(
  event: Pick<HistoryEvent, 'attributes'>
): event is SingleHistoryEvent {
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
    'workflowExecutionSignaledEventAttributes',
    'workflowExecutionTerminatedEventAttributes',
    'workflowExecutionCancelRequestedEventAttributes',
    'workflowExecutionCanceledEventAttributes',
    'workflowExecutionContinuedAsNewEventAttributes',
  ].includes(event?.attributes);
}
