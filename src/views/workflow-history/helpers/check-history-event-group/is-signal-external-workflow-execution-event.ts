import type { SignalExternalWorkflowExecutionHistoryEvent } from '../../workflow-history.types';

export default function isSignalExternalWorkflowExecutionEvent(event: {
  attributes?: string;
}): event is SignalExternalWorkflowExecutionHistoryEvent {
  if (!event?.attributes) return false;

  return [
    'signalExternalWorkflowExecutionInitiatedEventAttributes',
    'signalExternalWorkflowExecutionFailedEventAttributes',
    'externalWorkflowExecutionSignaledEventAttributes',
  ].includes(event.attributes);
}
