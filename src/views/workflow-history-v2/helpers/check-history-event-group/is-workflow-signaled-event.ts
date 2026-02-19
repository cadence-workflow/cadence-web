import type { WorkflowSignaledHistoryEvent } from '../../workflow-history-v2.types';

export default function isWorkflowSignaledEvent(event: {
  attributes: string;
}): event is WorkflowSignaledHistoryEvent {
  return event?.attributes === 'workflowExecutionSignaledEventAttributes';
}
