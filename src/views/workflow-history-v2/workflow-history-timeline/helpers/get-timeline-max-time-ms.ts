import {
  type TimelineRowWithEndTime,
  type TimelineRow,
} from '../workflow-history-timeline.types';

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

  const rowsWithEndTime = timelineRows.filter(
    (row): row is TimelineRowWithEndTime => row.endTimeMs !== null
  );

  if (rowsWithEndTime.length !== timelineRows.length) {
    // At least one row has a null endTimeMs
    return now;
  }

  const maxRowEndTime = rowsWithEndTime.reduce(
    (max, row) => Math.max(max, row.endTimeMs),
    0
  );

  return Math.max(maxRowEndTime, now);
}
