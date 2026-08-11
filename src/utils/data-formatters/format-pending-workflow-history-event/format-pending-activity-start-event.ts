import { type PendingActivityTaskStartEvent } from '@/views/workflow-history/workflow-history.types';

import formatEnum from '../format-enum';
import formatFailureDetails from '../format-failure-details';
import formatPayload from '../format-payload';
import formatTimestampToDatetime from '../format-timestamp-to-datetime';

export default function formatPendingActivityTaskStartEvent({
  pendingActivityTaskStartEventAttributes: {
    scheduleId,
    state,
    lastHeartbeatTime,
    lastStartedTime,
    scheduledTime,
    expirationTime,
    heartbeatDetails,
    lastFailure,
    ...eventAttributes
  },
  eventTime,
}: PendingActivityTaskStartEvent) {
  return {
    eventTime: formatTimestampToDatetime(eventTime),
    eventType: 'PendingActivityTaskStart',
    ...eventAttributes,
    state: formatEnum(state, 'PENDING_ACTIVITY_STATE', 'pascal'),
    lastFailureDetails: formatFailureDetails(lastFailure),
    lastFailureReason: lastFailure?.reason || null,
    heartbeatDetails: formatPayload(heartbeatDetails),
    scheduledTime: formatTimestampToDatetime(scheduledTime),
    lastHeartbeatTime: formatTimestampToDatetime(lastHeartbeatTime),
    lastStartedTime: formatTimestampToDatetime(lastStartedTime),
    expirationTime: formatTimestampToDatetime(expirationTime),
    scheduleId: parseInt(scheduleId),
  };
}
