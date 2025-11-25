import isChildWorkflowExecutionEvent from '@/views/workflow-history/helpers/check-history-event-group/is-child-workflow-execution-event';
import isExtendedActivityEvent from '@/views/workflow-history/helpers/check-history-event-group/is-extended-activity-event';
import isExtendedDecisionEvent from '@/views/workflow-history/helpers/check-history-event-group/is-extended-decision-event';
import isRequestCancelExternalWorkflowExecutionEvent from '@/views/workflow-history/helpers/check-history-event-group/is-request-cancel-external-workflow-execution-event';
import isSignalExternalWorkflowExecutionEvent from '@/views/workflow-history/helpers/check-history-event-group/is-signal-external-workflow-execution-event';
import isTimerEvent from '@/views/workflow-history/helpers/check-history-event-group/is-timer-event';
import { type WorkflowHistoryEventFilteringType } from '@/views/workflow-history/workflow-history-filters-type/workflow-history-filters-type.types';
import { type ExtendedHistoryEvent } from '@/views/workflow-history/workflow-history.types';

const getEventFilteringType = function (
  events: ExtendedHistoryEvent[]
): WorkflowHistoryEventFilteringType {
  if (events.length === 0) {
    // Default to WORKFLOW if no events
    return 'WORKFLOW';
  }

  // Check if all events are of the same type
  const firstEvent = events[0];

  // Check for SIGNAL first (has special logic)
  if (
    events.every(isSignalExternalWorkflowExecutionEvent) ||
    ('attributes' in firstEvent &&
      firstEvent.attributes === 'workflowExecutionSignaledEventAttributes')
  ) {
    return 'SIGNAL';
  }

  // Check for WORKFLOW (RequestCancelExternalWorkflowExecution or Event type with non-signal)
  const isNotSignal = !(
    'attributes' in firstEvent &&
    firstEvent.attributes === 'workflowExecutionSignaledEventAttributes'
  );
  if (
    events.every(isRequestCancelExternalWorkflowExecutionEvent) ||
    (isNotSignal &&
      !isExtendedActivityEvent(firstEvent) &&
      !isExtendedDecisionEvent(firstEvent) &&
      !isTimerEvent(firstEvent) &&
      !isChildWorkflowExecutionEvent(firstEvent) &&
      !isSignalExternalWorkflowExecutionEvent(firstEvent))
  ) {
    return 'WORKFLOW';
  }

  // Check other types
  if (events.every(isExtendedActivityEvent)) {
    return 'ACTIVITY';
  }

  if (events.every(isExtendedDecisionEvent)) {
    return 'DECISION';
  }

  if (events.every(isTimerEvent)) {
    return 'TIMER';
  }

  if (events.every(isChildWorkflowExecutionEvent)) {
    return 'CHILDWORKFLOW';
  }

  // Default fallback
  return 'WORKFLOW';
};

export default getEventFilteringType;
