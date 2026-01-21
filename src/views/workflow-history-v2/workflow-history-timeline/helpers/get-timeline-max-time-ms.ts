import max from 'lodash/max';

import { type TimelineRow } from '../workflow-history-timeline.types';

export default function getTimelineMaxTimeMs(
  workflowCloseTimeMs: number | null | undefined,
  timelineRows: Array<TimelineRow>
): number {
  const now = Date.now();

  if (workflowCloseTimeMs !== null && workflowCloseTimeMs !== undefined) {
    return workflowCloseTimeMs;
  }

  if (timelineRows.length === 0) {
    return now;
  }

  // timelineRows will always have at least one element here
  const maxRowEndTime = max(timelineRows.map((row) => row.endTimeMs))!;

  return Math.max(maxRowEndTime, now);
}
