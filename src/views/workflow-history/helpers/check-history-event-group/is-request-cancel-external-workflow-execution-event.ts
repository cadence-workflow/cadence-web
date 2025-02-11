import type { RequestCancelExternalWorkflowExecutionHistoryEvent } from '../../workflow-history.types';

export default function isRequestCancelExternalWorkflowExecutionEvent(event: {
  attributes: string;
}): event is RequestCancelExternalWorkflowExecutionHistoryEvent {
  return [
    'requestCancelExternalWorkflowExecutionInitiatedEventAttributes',
    'requestCancelExternalWorkflowExecutionFailedEventAttributes',
    'externalWorkflowExecutionCancelRequestedEventAttributes',
  ].includes(event?.attributes);
}
