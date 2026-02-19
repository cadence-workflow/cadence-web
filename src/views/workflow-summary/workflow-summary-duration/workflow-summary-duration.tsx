import { useEffect, useState } from 'react';

import getFormattedEventsDuration from '@/views/workflow-history-v2/workflow-history-event-group-duration/helpers/get-formatted-events-duration';

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
    setDuration(
      getFormattedEventsDuration(firstEventTime, closeEventTime, isOngoing)
    );
    if (isOngoing) {
      const interval = setInterval(() => {
        setDuration(
          getFormattedEventsDuration(firstEventTime, closeEventTime, true)
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [firstEventTime, closeEventTime, isOngoing]);

  return duration;
}
