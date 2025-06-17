import { type WorkflowHistoryUngroupedEventInfo } from '../workflow-history-ungrouped-event.types';

export default function getRetriesForHistoryEvent(
  event: WorkflowHistoryUngroupedEventInfo['event']
): number | undefined {
  if (
    event.attributes === 'workflowExecutionStartedEventAttributes' &&
    event.workflowExecutionStartedEventAttributes?.attempt
  ) {
    return event.workflowExecutionStartedEventAttributes?.attempt;
  }

  if (
    event.attributes === 'pendingActivityTaskStartEventAttributes' &&
    event.pendingActivityTaskStartEventAttributes.attempt
  ) {
    return event.pendingActivityTaskStartEventAttributes.attempt;
  }

  if (
    event.attributes === 'activityTaskStartedEventAttributes' &&
    event.activityTaskStartedEventAttributes?.attempt
  ) {
    return event.activityTaskStartedEventAttributes.attempt;
  }

  if (
    event.attributes === 'pendingDecisionTaskStartEventAttributes' &&
    event.pendingDecisionTaskStartEventAttributes.attempt
  ) {
    return event.pendingDecisionTaskStartEventAttributes.attempt;
  }

  if (
    event.attributes === 'decisionTaskScheduledEventAttributes' &&
    event.decisionTaskScheduledEventAttributes?.attempt
  )
    return event.decisionTaskScheduledEventAttributes.attempt;

  return undefined;
}
