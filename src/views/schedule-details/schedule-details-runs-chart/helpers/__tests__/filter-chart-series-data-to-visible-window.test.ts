import { type ChartSeriesData } from '../../../schedule-details-runs-chart-series/schedule-details-runs-chart-series.types';
import filterChartSeriesDataToVisibleWindow from '../filter-chart-series-data-to-visible-window';

const HOUR_MS = 60 * 60_000;
const nowMs = Date.UTC(2024, 0, 1, 12, 0);
const window = { minMs: nowMs - HOUR_MS, maxMs: nowMs + HOUR_MS };

const data: ChartSeriesData = {
  runs: [
    {
      workflowId: 'wf-in',
      runId: 'run-in',
      scheduledTimeMs: nowMs,
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
      startedTimeMs: null,
      endedTimeMs: null,
    },
    {
      workflowId: 'wf-out',
      runId: 'run-out',
      scheduledTimeMs: nowMs - 5 * HOUR_MS,
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
      startedTimeMs: null,
      endedTimeMs: null,
    },
  ],
  skippedExecutions: [
    { scheduledTimeMs: nowMs - 5 * HOUR_MS },
    { scheduledTimeMs: nowMs - HOUR_MS },
  ],
  unconfirmedExecutions: [{ scheduledTimeMs: nowMs + 5 * HOUR_MS }],
  nextExecutionTimeMs: nowMs + HOUR_MS,
};

describe(filterChartSeriesDataToVisibleWindow.name, () => {
  it('drops points outside the visible window and keeps points at its edges', () => {
    expect(filterChartSeriesDataToVisibleWindow(data, window)).toEqual({
      runs: [expect.objectContaining({ runId: 'run-in' })],
      skippedExecutions: [{ scheduledTimeMs: nowMs - HOUR_MS }],
      unconfirmedExecutions: [],
      nextExecutionTimeMs: nowMs + HOUR_MS,
    });
  });

  it('nulls the next execution time when it falls outside the window', () => {
    const result = filterChartSeriesDataToVisibleWindow(data, {
      minMs: nowMs - HOUR_MS,
      maxMs: nowMs,
    });

    expect(result.nextExecutionTimeMs).toBeNull();
  });

  it('returns empty data when there is no visible window yet', () => {
    expect(filterChartSeriesDataToVisibleWindow(data, null)).toEqual({
      runs: [],
      skippedExecutions: [],
      unconfirmedExecutions: [],
      nextExecutionTimeMs: null,
    });
  });
});
