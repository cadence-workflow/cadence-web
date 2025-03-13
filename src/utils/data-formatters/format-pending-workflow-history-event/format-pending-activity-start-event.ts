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
    ...eventAttributes,
    eventTime: formatTimestampToDatetime(eventTime),
    eventType: 'PendingActivityTaskStart',
    state: formatEnum(state, 'PENDING_ACTIVITY_STATE', 'pascal'),
    scheduleId: parseInt(scheduleId),
    lastHeartbeatTime: formatTimestampToDatetime(lastHeartbeatTime),
    lastStartedTime: formatTimestampToDatetime(lastStartedTime),
    scheduledTime: formatTimestampToDatetime(scheduledTime),
    expirationTime: formatTimestampToDatetime(expirationTime),
    heartbeatDetails: formatPayload(heartbeatDetails),
    lastFailureDetails: formatFailureDetails(lastFailure),
    lastFailureReason: lastFailure?.reason,
  };
}
