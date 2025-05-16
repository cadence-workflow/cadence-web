import React, { useEffect, useState } from 'react';

import { Badge } from 'baseui/badge';

import formatDuration from '@/utils/data-formatters/format-duration';
import dayjs from '@/utils/datetime/dayjs';

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

  const calculateDuration = () => {
    const end = endTime ? dayjs(endTime) : dayjs();
    const start = dayjs(startTime);
    const diff = end.diff(start);
    const durationObj = dayjs.duration(diff);
    return formatDuration(
      {
        seconds: durationObj.asSeconds().toString(),
        nanos: 0,
      },
      { separator: ' ' }
    );
  };

  const [duration, setDuration] = useState<string>(() => calculateDuration());

  useEffect(() => {
    setDuration(calculateDuration());
    if (!endTime && !noDuration) {
      const interval = setInterval(() => {
        setDuration(calculateDuration());
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
