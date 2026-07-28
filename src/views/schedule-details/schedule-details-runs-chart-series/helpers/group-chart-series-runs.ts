import { type ChartSeriesRun } from '../schedule-details-runs-chart-series.types';

export type ChartSeriesRunGroup = {
  scheduledTimeMs: number;
  runs: ChartSeriesRun[];
};

/** Runs sharing a scheduled-time bucket render as one stacked marker with a count. */
export default function groupChartSeriesRuns(
  runs: ChartSeriesRun[]
): ChartSeriesRunGroup[] {
  const runsByScheduledTimeMs = new Map<number, ChartSeriesRun[]>();

  for (const run of runs) {
    const group = runsByScheduledTimeMs.get(run.scheduledTimeMs);
    if (group) {
      group.push(run);
    } else {
      runsByScheduledTimeMs.set(run.scheduledTimeMs, [run]);
    }
  }

  return Array.from(
    runsByScheduledTimeMs,
    ([scheduledTimeMs, groupedRuns]) => ({
      scheduledTimeMs,
      runs: groupedRuns,
    })
  );
}
