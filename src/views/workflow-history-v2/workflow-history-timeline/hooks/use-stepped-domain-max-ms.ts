import { useMemo, useRef } from 'react';

import getTimelineMaxTimeMs from '../helpers/get-timeline-max-time-ms';
import { TIMELINE_DOMAIN_BUFFER_PERCENT } from '../workflow-history-timeline.constants';
import { type TimelineRow } from '../workflow-history-timeline.types';

export default function useSteppedDomainMaxMs({
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
  const domainMaxRef = useRef<number | null>(null);

  const requiredMaxTimeMs = getTimelineMaxTimeMs(
    workflowCloseTimeMs,
    timelineRows,
    currentTimeMs
  );

  const requiredMaxOffsetMs = useMemo(
    () => requiredMaxTimeMs - workflowStartTimeMs,
    [requiredMaxTimeMs, workflowStartTimeMs]
  );

  if (workflowCloseTimeMs !== null && workflowCloseTimeMs !== undefined) {
    return requiredMaxOffsetMs;
  }

  if (
    domainMaxRef.current === null ||
    requiredMaxOffsetMs >= domainMaxRef.current
  ) {
    domainMaxRef.current =
      requiredMaxOffsetMs * (1 + TIMELINE_DOMAIN_BUFFER_PERCENT);
  }

  return domainMaxRef.current;
}
