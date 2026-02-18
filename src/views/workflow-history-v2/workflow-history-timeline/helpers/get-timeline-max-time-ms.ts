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

  const hasRowInProgress = timelineRows.some((row) => row.endTimeMs === null);
  if (hasRowInProgress) {
    return now;
  }

  const maxRowEndTime = timelineRows.reduce((max, row) => {
    // This check will always evaluate to false, since this helper
    // would have returned early if any rows didn't have an end time
    if (row.endTimeMs === null) return max;
    return Math.max(max, row.endTimeMs);
  }, 0);

  return Math.max(maxRowEndTime, now);
}
