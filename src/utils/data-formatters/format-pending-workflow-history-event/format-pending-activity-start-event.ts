import { type PendingActivityTaskStartEvent } from '@/views/workflow-history/workflow-history.types';

import formatEnum from '../format-enum';
import formatFailureDetails from '../format-failure-details';
import formatPayload from '../format-payload';
import formatTimestampToDatetime from '../format-timestamp-to-datetime';

export default function formatPendingActivityTaskStartEvent({
  pendingActivityTaskStartEventAttributes: pendingInfo,
  eventTime,
  eventId,
}: PendingActivityTaskStartEvent) {
  return {
    ...pendingInfo,
    eventId,
    eventTime: formatTimestampToDatetime(eventTime),
    eventType: 'PendingActivityTaskStart',
    state: formatEnum(pendingInfo.state, 'PENDING_ACTIVITY_STATE', 'pascal'),

    scheduleId: parseInt(pendingInfo.scheduleId),
    lastHeartbeatTime: formatTimestampToDatetime(pendingInfo.lastHeartbeatTime),
    lastStartedTime: formatTimestampToDatetime(pendingInfo.lastStartedTime),
    scheduledTime: formatTimestampToDatetime(pendingInfo.scheduledTime),
    expirationTime: formatTimestampToDatetime(pendingInfo.expirationTime),
    heartbeatDetails: formatPayload(pendingInfo.heartbeatDetails),
    lastFailureDetails: formatFailureDetails(pendingInfo.lastFailure),
    lastFailureReason: pendingInfo.lastFailure?.reason,
  };
}
