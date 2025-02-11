import type { SignalExternalWorkflowExecutionHistoryEvent } from '../../workflow-history.types';

export default function isSignalExternalWorkflowExecutionEvent(event: {
  attributes: string;
}): event is SignalExternalWorkflowExecutionHistoryEvent {
  return [
    'signalExternalWorkflowExecutionInitiatedEventAttributes',
    'signalExternalWorkflowExecutionFailedEventAttributes',
    'externalWorkflowExecutionSignaledEventAttributes',
  ].includes(event?.attributes);
}
