import { useEffect, useState } from 'react';

import { type WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';
import getFormattedEventsDuration from '@/views/workflow-history/workflow-history-events-duration-badge/helpers/get-formatted-events-duration';

export default function useEventGroupDuration({
  startTime,
  closeTime,
  workflowIsArchived,
  workflowCloseStatus,
  eventsCount,
  loadingMoreEvents,
  hasMissingEvents,
  workflowCloseTime,
}: {
  startTime: number | null | undefined;
  closeTime: number | null | undefined;
  workflowIsArchived: boolean;
  workflowCloseStatus: WorkflowExecutionCloseStatus | null | undefined;
  eventsCount: number;
  loadingMoreEvents: boolean;
  hasMissingEvents: boolean;
  workflowCloseTime: number | null | undefined;
}) {
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

  return duration;
}
