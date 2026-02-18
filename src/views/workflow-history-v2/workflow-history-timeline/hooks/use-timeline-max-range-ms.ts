import { useMemo, useRef } from 'react';

import getTimelineMaxTimeMs from '../helpers/get-timeline-max-time-ms';
import { TIMELINE_RANGE_BUFFER_RATIO } from '../workflow-history-timeline.constants';
import { type TimelineRow } from '../workflow-history-timeline.types';

export default function useTimelineMaxRangeMs({
  timelineRows,
  workflowStartTimeMs,
  workflowCloseTimeMs,
  currentTimeMs,
}: {
  timelineRows: Array<TimelineRow>;
  workflowStartTimeMs: number;
  workflowCloseTimeMs: number | null | undefined;
  currentTimeMs: number;
}): number {
  const maxRangeRef = useRef<number | null>(null);

  const requiredMaxTimeMs = useMemo(
    () =>
      getTimelineMaxTimeMs(workflowCloseTimeMs, timelineRows, currentTimeMs),
    [currentTimeMs, timelineRows, workflowCloseTimeMs]
  );

  const requiredMaxOffsetMs = useMemo(
    () => requiredMaxTimeMs - workflowStartTimeMs,
    [requiredMaxTimeMs, workflowStartTimeMs]
  );

  if (workflowCloseTimeMs !== null && workflowCloseTimeMs !== undefined) {
    return requiredMaxOffsetMs;
  }

  if (
    maxRangeRef.current === null ||
    requiredMaxOffsetMs >= maxRangeRef.current
  ) {
    maxRangeRef.current =
      requiredMaxOffsetMs * (1 + TIMELINE_RANGE_BUFFER_RATIO);
  }

  return maxRangeRef.current;
}
