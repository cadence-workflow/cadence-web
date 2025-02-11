import omit from 'lodash/omit';

import { type PendingDecisionTaskScheduleEvent } from '@/views/workflow-history/workflow-history.types';

import formatTimestampToDatetime from '../format-timestamp-to-datetime';

const formatPendingDecisionTaskScheduleEvent = ({
  pendingDecisionTaskScheduleEventAttributes: pendingInfo,
  eventTime,
  eventId,
}: PendingDecisionTaskScheduleEvent) => {
  return {
    ...omit(pendingInfo, 'state'),
    eventId: parseInt(eventId),
    eventType: 'PendingDecisionTaskSchedule',
    eventTime: formatTimestampToDatetime(eventTime),

    scheduleId: parseInt(pendingInfo.scheduleId),
    scheduledTime: formatTimestampToDatetime(pendingInfo.scheduledTime),
    startedTime: formatTimestampToDatetime(pendingInfo.startedTime),
    originalScheduledTime: formatTimestampToDatetime(
      pendingInfo.originalScheduledTime
    ),
  };
};

export default formatPendingDecisionTaskScheduleEvent;
