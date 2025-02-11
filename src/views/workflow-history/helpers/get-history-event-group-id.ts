import { type ExtendedHistoryEvent } from '../workflow-history.types';

import isChildWorkflowExecutionEvent from './check-history-event-group/is-child-workflow-execution-event';
import isExtendedActivityEvent from './check-history-event-group/is-extended-activity-event';
import isExtendedDecisionEvent from './check-history-event-group/is-extended-decision-event';
import isRequestCancelExternalWorkflowExecutionEvent from './check-history-event-group/is-request-cancel-external-workflow-execution-event';
import isSignalExternalWorkflowExecutionEvent from './check-history-event-group/is-signal-external-workflow-execution-event';
import isTimerEvent from './check-history-event-group/is-timer-event';

export default function getHistoryEventGroupId(
  event: ExtendedHistoryEvent
): string | undefined {
  if (event.attributes === 'pendingActivityTaskStartEventAttributes') {
    return event[event.attributes]?.scheduleId;
  } else if (
    event.attributes === 'pendingDecisionTaskScheduleEventAttributes'
  ) {
    return event[event.attributes]?.scheduleId;
  } else if (
    isExtendedActivityEvent(event) &&
    event.attributes !== 'activityTaskScheduledEventAttributes'
  ) {
    return event[event.attributes]?.scheduledEventId;
  } else if (
    isExtendedDecisionEvent(event) &&
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
