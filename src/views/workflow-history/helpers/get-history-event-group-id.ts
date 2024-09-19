import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import isActivityEvent from './check-history-event-group/is-activity-event';
import isChildWorkflowExecutionEvent from './check-history-event-group/is-child-workflow-execution-event';
import isDecisionEvent from './check-history-event-group/is-decision-event';
import isRequestCancelExternalWorkflowExecutionEvent from './check-history-event-group/is-request-cancel-external-workflow-execution-event';
import isSignalExternalWorkflowExecutionEvent from './check-history-event-group/is-signal-external-workflow-execution-event';
import isTimerEvent from './check-history-event-group/is-timer-event';

export default function getHistoryEventGroupId(
  event: HistoryEvent
): string | undefined {
  if (
    isActivityEvent(event) &&
    event.attributes !== 'activityTaskScheduledEventAttributes'
  ) {
    return event[event.attributes]?.scheduledEventId;
  } else if (
    isDecisionEvent(event) &&
    event.attributes !== 'decisionTaskScheduledEventAttributes'
  ) {
    return event[event.attributes]?.scheduledEventId;
  } else if (
    isTimerEvent(event) &&
    event.attributes !== 'timerStartedEventAttributes'
  ) {
    return event[event.attributes]?.startedEventId;
  } else if (
    isChildWorkflowExecutionEvent(event) &&
    event.attributes !== 'startChildWorkflowExecutionInitiatedEventAttributes'
  ) {
    return event[event.attributes]?.initiatedEventId;
  } else if (
    isSignalExternalWorkflowExecutionEvent(event) &&
    event.attributes !==
      'signalExternalWorkflowExecutionInitiatedEventAttributes'
  ) {
    return event[event.attributes]?.initiatedEventId;
  } else if (
    isRequestCancelExternalWorkflowExecutionEvent(event) &&
    event.attributes !==
      'requestCancelExternalWorkflowExecutionInitiatedEventAttributes'
  ) {
    return event[event.attributes]?.initiatedEventId;
  } else {
    return event?.eventId;
  }
}
