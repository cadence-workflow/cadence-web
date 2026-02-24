import React, { useEffect, useState } from 'react';

import formatTimeDiff from '@/utils/datetime/format-time-diff';
import WorkflowHistoryRemainingDurationBadge from '@/views/workflow-history/workflow-history-remaining-duration-badge/workflow-history-remaining-duration-badge';

import { styled } from './workflow-history-event-group-duration.styles';
import { type Props } from './workflow-history-event-group-duration.types';

export default function WorkflowHistoryEventGroupDuration({
  startTime,
  closeTime,
  expectedEndTimeInfo,
  workflowIsArchived,
  workflowCloseStatus,
  eventsCount,
  hasMissingEvents,
  loadingMoreEvents,
  workflowCloseTime,
}: Props) {
  const endTime = closeTime || workflowCloseTime;
  const workflowEnded =
    workflowIsArchived ||
    workflowCloseStatus !== 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID';
  const singleEvent = eventsCount === 1 && !hasMissingEvents;

  const hideDuration =
    loadingMoreEvents || singleEvent || (workflowEnded && !endTime);
  const isOngoing = !endTime && !hideDuration;

  const [duration, setDuration] = useState<string>(() =>
    formatTimeDiff(startTime ?? null, endTime, isOngoing)
  );

  useEffect(() => {
    setDuration(formatTimeDiff(startTime ?? null, endTime, isOngoing));
    if (isOngoing) {
      const interval = setInterval(() => {
        setDuration(formatTimeDiff(startTime ?? null, endTime, true));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startTime, endTime, isOngoing]);

  if (!startTime) {
    return null;
  }

  return (
    <styled.DurationContainer>
      {!hideDuration && duration}
      {expectedEndTimeInfo ? (
        <WorkflowHistoryRemainingDurationBadge
          startTime={startTime}
          expectedEndTime={expectedEndTimeInfo.timeMs}
          prefix={expectedEndTimeInfo.prefix}
          workflowIsArchived={workflowIsArchived}
          workflowCloseStatus={workflowCloseStatus}
          loadingMoreEvents={loadingMoreEvents}
        />
      ) : null}
    </styled.DurationContainer>
  );
}
