import { type TaskListHandlerKind } from '../workflow-history-event-details-task-list-link.types';

export default function getTaskListHandlerKindForEventType(
  eventType: string | undefined
): TaskListHandlerKind {
  if (eventType === 'ActivityTaskScheduled') return 'activity';
  if (
    eventType === 'DecisionTaskScheduled' ||
    eventType === 'WorkflowExecutionStarted' ||
    eventType === 'WorkflowExecutionContinuedAsNew' ||
    eventType === 'StartChildWorkflowExecutionInitiated'
  ) {
    return 'decision';
  }
  return 'workers';
}
