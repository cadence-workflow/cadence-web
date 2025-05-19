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
  workflowCloseTime,
}: Props) {
  const endTime = closeTime || workflowCloseTime;
  const workflowEnded =
    workflowIsArchived ||
    workflowCloseStatus !== 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID';
  const singleEvent = eventsCount === 1 && !hasMissingEvents;
  const noDuration = singleEvent || (workflowEnded && !endTime);

  const [duration, setDuration] = useState<string>(() =>
    getFormattedEventsDuration(startTime, endTime)
  );

  useEffect(() => {
    setDuration(getFormattedEventsDuration(startTime, endTime));
    if (!endTime && !noDuration) {
      const interval = setInterval(() => {
        setDuration(getFormattedEventsDuration(startTime, endTime));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startTime, endTime, noDuration]);

  if (noDuration) {
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
