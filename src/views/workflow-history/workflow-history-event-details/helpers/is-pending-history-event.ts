import type { PendingHistoryEvent } from '../../workflow-history.types';

export default function isPendingHistoryEvent(event: {
  attributes: string;
}): event is PendingHistoryEvent {
  return (
    event?.attributes === 'pendingActivityTaskStartEventAttributes' ||
    event?.attributes === 'pendingDecisionTaskScheduleEventAttributes'
  );
}
