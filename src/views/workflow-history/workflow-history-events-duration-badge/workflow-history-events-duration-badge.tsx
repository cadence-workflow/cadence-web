import React, { useEffect, useState } from 'react';

import { Badge } from 'baseui/badge';

import getFormattedEventsDuration from './helpers/get-formatted-events-duration';
import { overrides } from './workflow-history-events-duration-badge.styles';
import { type Props } from './workflow-history-events-duration-badge.types';
export default function WorkflowHistoryEventsDurationBadge({
  startTime,
  closeTime,
  workflowIsArchived,
  workflowCloseStatus,
  eventsCount,
  hasMissingEvents,
  loadingMoreEvents,
  workflowCloseTime,
  showOngoingOnly,
}: Props) {
  const endTime = closeTime || workflowCloseTime;
  const workflowEnded =
    workflowIsArchived ||
    workflowCloseStatus !== 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID';
  const singleEvent = eventsCount === 1 && !hasMissingEvents;
  const noDuration =
    loadingMoreEvents || singleEvent || (workflowEnded && !endTime);
  const hideDuration = (showOngoingOnly && endTime) || noDuration;
  const isOngoing = !endTime && !hideDuration;

  const [duration, setDuration] = useState<string>(() =>
    getFormattedEventsDuration(startTime, endTime, isOngoing)
  );

  useEffect(() => {
    setDuration(getFormattedEventsDuration(startTime, endTime, isOngoing));
    if (isOngoing) {
      const interval = setInterval(() => {
        setDuration(getFormattedEventsDuration(startTime, endTime, true));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startTime, endTime, isOngoing]);

  if (hideDuration) {
    return null;
  }

  return (
    <Badge
      overrides={overrides.Badge}
      content={`Duration: ${duration}`}
      shape="rectangle"
      color={endTime ? 'primary' : 'accent'}
      hierarchy={endTime ? 'secondary' : 'primary'}
    />
  );
}
