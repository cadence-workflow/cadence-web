import { type PendingDecisionTaskStartEvent } from '@/views/workflow-history/workflow-history.types';

import formatEnum from '../format-enum';
import formatTimestampToDatetime from '../format-timestamp-to-datetime';

const formatPendingDecisionTaskStartEvent = ({
  pendingDecisionTaskStartEventAttributes: {
    state,
    scheduleId,
    startedTime,
    scheduledTime,
    originalScheduledTime,
    ...eventAttributes
  },
  eventTime,
}: PendingDecisionTaskStartEvent) => {
  return {
    ...eventAttributes,
    state: formatEnum(state, 'PENDING_DECISION_STATE', 'pascal'),
    eventType: 'PendingDecisionTaskStart',
    eventTime: formatTimestampToDatetime(eventTime),
    scheduleId: parseInt(scheduleId),
    scheduledTime: formatTimestampToDatetime(scheduledTime),
    startedTime: formatTimestampToDatetime(startedTime),
    originalScheduledTime: formatTimestampToDatetime(originalScheduledTime),
  };
};

export default formatPendingDecisionTaskStartEvent;
