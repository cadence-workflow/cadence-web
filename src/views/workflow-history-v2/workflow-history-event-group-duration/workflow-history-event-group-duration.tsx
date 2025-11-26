import React, { useEffect, useState } from 'react';

import getFormattedEventsDuration from './helpers/get-formatted-events-duration';
import { type Props } from './workflow-history-event-group-duration.types';

export default function WorkflowHistoryEventGroupDuration({
  startTime,
  closeTime,
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
    getFormattedEventsDuration(startTime ?? null, endTime, isOngoing)
  );

  useEffect(() => {
    setDuration(
      getFormattedEventsDuration(startTime ?? null, endTime, isOngoing)
    );
    if (isOngoing) {
      const interval = setInterval(() => {
        setDuration(
          getFormattedEventsDuration(startTime ?? null, endTime, true)
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startTime, endTime, isOngoing]);

  if (!startTime || hideDuration) {
    return null;
  }

  return <>{duration}</>;
}
