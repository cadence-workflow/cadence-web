import { type ChartSeriesData } from '../../../schedule-details-runs-chart-series/schedule-details-runs-chart-series.types';
import filterChartSeriesDataToVisibleWindow from '../filter-chart-series-data-to-visible-window';

const hourMs = 60 * 60_000;
const nowMs = Date.UTC(2024, 0, 1, 12, 0);
const window = { minMs: nowMs - hourMs, maxMs: nowMs + hourMs };

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
      scheduledTimeMs: nowMs - 5 * hourMs,
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
      startedTimeMs: null,
      endedTimeMs: null,
    },
  ],
  skippedExecutions: [
    { scheduledTimeMs: nowMs - 5 * hourMs },
    { scheduledTimeMs: nowMs - hourMs },
  ],
  unconfirmedExecutions: [{ scheduledTimeMs: nowMs + 5 * hourMs }],
  nextExecutionTimeMs: nowMs + hourMs,
};

describe(filterChartSeriesDataToVisibleWindow.name, () => {
  it('drops points outside the visible window and keeps points at its edges', () => {
    expect(filterChartSeriesDataToVisibleWindow(data, window)).toEqual({
      runs: [expect.objectContaining({ runId: 'run-in' })],
      skippedExecutions: [{ scheduledTimeMs: nowMs - hourMs }],
      unconfirmedExecutions: [],
      nextExecutionTimeMs: nowMs + hourMs,
    });
  });

  it('nulls the next execution time when it falls outside the window', () => {
    const result = filterChartSeriesDataToVisibleWindow(data, {
      minMs: nowMs - hourMs,
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
