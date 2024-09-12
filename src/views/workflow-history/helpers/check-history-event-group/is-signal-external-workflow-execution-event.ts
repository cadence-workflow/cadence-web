import type { HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import type { SignalExternalWorkflowExecutionHistoryEvent } from '../../workflow-history.types';

export default function isSignalExternalWorkflowExecutionEvent(
  event: Pick<HistoryEvent, 'attributes'>
): event is SignalExternalWorkflowExecutionHistoryEvent {
  return [
    'signalExternalWorkflowExecutionInitiatedEventAttributes',
    'signalExternalWorkflowExecutionFailedEventAttributes',
    'externalWorkflowExecutionSignaledEventAttributes',
  ].includes(event?.attributes);
}
