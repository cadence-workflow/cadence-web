import { useEffect, useState } from 'react';

import formatTimeDiff from '@/utils/datetime/format-time-diff';

import { type WorkflowSummaryFieldArgs } from '../workflow-summary-details/workflow-summary-details.types';

export default function WorkflowSummaryDuration({
  formattedFirstEvent,
  formattedCloseEvent,
}: Pick<
  WorkflowSummaryFieldArgs,
  'formattedFirstEvent' | 'formattedCloseEvent'
>) {
  const firstEventTime = formattedFirstEvent?.timestamp ?? null;
  const closeEventTime = formattedCloseEvent?.timestamp ?? null;
  const isOngoing = closeEventTime === null;

  const [duration, setDuration] = useState<string>('-');

  useEffect(() => {
    if (!firstEventTime) return;

    setDuration(formatTimeDiff(firstEventTime, closeEventTime, isOngoing));

    if (isOngoing) {
      const interval = setInterval(() => {
        setDuration(formatTimeDiff(firstEventTime, closeEventTime, true));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [firstEventTime, closeEventTime, isOngoing]);

  return duration;
}
