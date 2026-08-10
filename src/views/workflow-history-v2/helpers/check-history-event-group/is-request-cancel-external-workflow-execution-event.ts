import type { RequestCancelExternalWorkflowExecutionHistoryEvent } from '../../workflow-history-v2.types';

export default function isRequestCancelExternalWorkflowExecutionEvent(event: {
  attributes?: string;
}): event is RequestCancelExternalWorkflowExecutionHistoryEvent {
  if (!event?.attributes) return false;

  return [
    'requestCancelExternalWorkflowExecutionInitiatedEventAttributes',
    'requestCancelExternalWorkflowExecutionFailedEventAttributes',
    'externalWorkflowExecutionCancelRequestedEventAttributes',
  ].includes(event.attributes);
}
