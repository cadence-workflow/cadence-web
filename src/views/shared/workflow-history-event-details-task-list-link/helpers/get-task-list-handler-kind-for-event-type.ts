import { type TaskListHandlerKind } from '../workflow-history-event-details-task-list-link.types';

export default function getTaskListHandlerKindForEventType(
  eventType: string | undefined
): TaskListHandlerKind {
  if (eventType === 'ActivityTaskScheduled') return 'activity';
  // The events below are not all decision-task events, but their taskList is
  // always the workflow queue that Cadence polls as TASK_LIST_TYPE_DECISION,
  // so decision handlers is the count that answers "can this run make progress".
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
