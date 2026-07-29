/**
 * Drops points that land on or after the next run. The next run time and the
 * run list come from two independently polled APIs, so a run that has just
 * started would otherwise stack on top of the next-run marker until the
 * schedule description catches up.
 */
export default function filterChartPointsBeforeNextExecution<
  TPoint extends { scheduledTimeMs: number },
>(points: TPoint[], nextExecutionTimeMs: number | null): TPoint[] {
  if (nextExecutionTimeMs == null) {
    return points;
  }

  return points.filter(
    ({ scheduledTimeMs }) => scheduledTimeMs < nextExecutionTimeMs
  );
}
