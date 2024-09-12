import type { HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import type { ChildWorkflowExecutionHistoryEvent } from '../../workflow-history.types';

export default function isChildWorkflowExecutionEvent(
  event: Pick<HistoryEvent, 'attributes'>
): event is ChildWorkflowExecutionHistoryEvent {
  return [
    'startChildWorkflowExecutionInitiatedEventAttributes',
    'startChildWorkflowExecutionFailedEventAttributes',
    'childWorkflowExecutionStartedEventAttributes',
    'childWorkflowExecutionCompletedEventAttributes',
    'childWorkflowExecutionFailedEventAttributes',
    'childWorkflowExecutionCanceledEventAttributes',
    'childWorkflowExecutionTimedOutEventAttributes',
    'childWorkflowExecutionTerminatedEventAttributes',
  ].includes(event?.attributes);
}
