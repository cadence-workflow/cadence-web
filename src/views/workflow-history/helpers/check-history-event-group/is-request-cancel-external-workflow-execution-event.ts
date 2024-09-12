import type { HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import type { RequestCancelExternalWorkflowExecutionHistoryEvent } from '../../workflow-history.types';

export default function isRequestCancelExternalWorkflowExecutionEvent(
  event: Pick<HistoryEvent, 'attributes'>
): event is RequestCancelExternalWorkflowExecutionHistoryEvent {
  return [
    'requestCancelExternalWorkflowExecutionInitiatedEventAttributes',
    'requestCancelExternalWorkflowExecutionFailedEventAttributes',
    'externalWorkflowExecutionCancelRequestedEventAttributes',
  ].includes(event?.attributes);
}
