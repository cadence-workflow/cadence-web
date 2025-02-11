import type { ChildWorkflowExecutionHistoryEvent } from '../../workflow-history.types';

export default function isChildWorkflowExecutionEvent(event: {
  attributes: string;
}): event is ChildWorkflowExecutionHistoryEvent {
  return [
    'startChildWorkflowExecutionInitiatedEventAttributes',
    'startChildWorkflowExecutionFailedEventAttributes',
    'childWorkflowExecutionStartedEventAttributes',
    'childWorkflowExecutionCompletedEventAttributes',
    'childWorkflowExecutionFailedEventAttributes',
    'childWorkflowExecutionCanceledEventAttributes',
    'childWorkflowExecutionTimedOutEventAttributes',
    'childWorkflowExecutionTerminatedEventAttributes',
  ].includes(event?.attributes);
}
