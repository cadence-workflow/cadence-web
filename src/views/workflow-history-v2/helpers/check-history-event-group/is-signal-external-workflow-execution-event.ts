import type { SignalExternalWorkflowExecutionHistoryEvent } from '../../workflow-history-v2.types';

export default function isSignalExternalWorkflowExecutionEvent(event: {
  attributes: string;
}): event is SignalExternalWorkflowExecutionHistoryEvent {
  return [
    'signalExternalWorkflowExecutionInitiatedEventAttributes',
    'signalExternalWorkflowExecutionFailedEventAttributes',
    'externalWorkflowExecutionSignaledEventAttributes',
  ].includes(event?.attributes);
}
