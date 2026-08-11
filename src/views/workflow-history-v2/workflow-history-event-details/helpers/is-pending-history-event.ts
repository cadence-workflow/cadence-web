import type { PendingHistoryEvent } from '../../workflow-history-v2.types';

export default function isPendingHistoryEvent(event: {
  attributes?: string;
}): event is PendingHistoryEvent {
  return (
    event?.attributes === 'pendingActivityTaskStartEventAttributes' ||
    event?.attributes === 'pendingDecisionTaskStartEventAttributes'
  );
}
