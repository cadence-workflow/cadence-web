import max from 'lodash/max';

import { type TimelineRow } from '../workflow-history-timeline.types';

export default function getTimelineMaxTimeMs(
  workflowCloseTimeMs: number | null | undefined,
  timelineRows: Array<TimelineRow>,
  now: number
): number {
  if (workflowCloseTimeMs !== null && workflowCloseTimeMs !== undefined) {
    return workflowCloseTimeMs;
  }

  if (timelineRows.length === 0) {
    return now;
  }

  const maxRowEndTime = max(timelineRows.map((row) => row.endTimeMs))!;
  return Math.max(maxRowEndTime, now);
}
