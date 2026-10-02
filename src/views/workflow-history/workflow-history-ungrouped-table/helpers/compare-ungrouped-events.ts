import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';
import isPendingHistoryEvent from '@/views/workflow-history/workflow-history-event-details/helpers/is-pending-history-event';

import { type UngroupedEventInfo } from '../workflow-history-ungrouped-table.types';

export default function compareUngroupedEvents(
  eventA: UngroupedEventInfo,
  eventB: UngroupedEventInfo
) {
  const isPendingA = isPendingHistoryEvent(eventA.event);
  const isPendingB = isPendingHistoryEvent(eventB.event);

  // If both history events are non-pending ones, order by event ID
  if (!isPendingA && !isPendingB) {
    return parseInt(eventA.id) - parseInt(eventB.id);
  }

  // Put non-pending history events before pending ones
  if (!isPendingA) return -1;
  if (!isPendingB) return 1;

  if (!eventA.event.eventTime || !eventB.event.eventTime) return 0;

  // Sort pending events by scheduled time
  return (
    parseGrpcTimestamp(eventA.event.eventTime) -
    parseGrpcTimestamp(eventB.event.eventTime)
  );
}
