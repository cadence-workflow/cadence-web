import getSkippedScheduleExecutions from '../helpers/get-skipped-schedule-executions';

const HOUR_MS = 60 * 60_000;

const actualExecution = (scheduledTimeMs: number) => ({
  scheduledTimeMs,
  runs: [
    {
      workflowId: `workflow-${scheduledTimeMs}`,
      runId: String(scheduledTimeMs),
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED' as const,
      scheduledTimeMs,
      startedTimeMs: scheduledTimeMs,
      endedTimeMs: scheduledTimeMs,
    },
  ],
});

describe(getSkippedScheduleExecutions.name, () => {
  it('subtracts actual runs from expected cron occurrences', () => {
    expect(
      getSkippedScheduleExecutions({
        cronExpression: '0 * * * *',
        inferenceStartMs: 0,
        scheduleEndMs: null,
        oldestLoadedScheduleTimeMs: 0,
        hasNextPage: false,
        nowMs: 3 * HOUR_MS,
        jitterMs: 0,
        actualExecutions: [
          actualExecution(HOUR_MS),
          actualExecution(3 * HOUR_MS),
        ],
      })
    ).toEqual([
      { scheduledTimeMs: 0, runs: [] },
      { scheduledTimeMs: 2 * HOUR_MS, runs: [] },
    ]);
  });

  it('does not infer before the oldest loaded run while pages remain', () => {
    expect(
      getSkippedScheduleExecutions({
        cronExpression: '0 * * * *',
        inferenceStartMs: 0,
        scheduleEndMs: null,
        oldestLoadedScheduleTimeMs: 2 * HOUR_MS,
        hasNextPage: true,
        nowMs: 4 * HOUR_MS,
        jitterMs: 0,
        actualExecutions: [actualExecution(2 * HOUR_MS)],
      }).map(({ scheduledTimeMs }) => scheduledTimeMs)
    ).toEqual([3 * HOUR_MS, 4 * HOUR_MS]);
  });

  it('waits for a trustworthy loaded boundary', () => {
    expect(
      getSkippedScheduleExecutions({
        cronExpression: '0 * * * *',
        inferenceStartMs: 0,
        scheduleEndMs: null,
        oldestLoadedScheduleTimeMs: null,
        hasNextPage: true,
        nowMs: 4 * HOUR_MS,
        jitterMs: 0,
        actualExecutions: [],
      })
    ).toEqual([]);
  });

  it('respects the schedule end and jitter window', () => {
    expect(
      getSkippedScheduleExecutions({
        cronExpression: '0 * * * *',
        inferenceStartMs: 0,
        scheduleEndMs: 2 * HOUR_MS,
        oldestLoadedScheduleTimeMs: 0,
        hasNextPage: false,
        nowMs: 4 * HOUR_MS,
        jitterMs: 10 * 60_000,
        actualExecutions: [actualExecution(HOUR_MS + 5 * 60_000)],
      }).map(({ scheduledTimeMs }) => scheduledTimeMs)
    ).toEqual([0, 2 * HOUR_MS]);
  });

  it('does not render a skipped marker for the reported next execution', () => {
    expect(
      getSkippedScheduleExecutions({
        cronExpression: '0 * * * *',
        inferenceStartMs: 0,
        scheduleEndMs: null,
        oldestLoadedScheduleTimeMs: 0,
        hasNextPage: false,
        nowMs: 2 * HOUR_MS,
        nextExecutionTimeMs: 2 * HOUR_MS,
        jitterMs: 0,
        actualExecutions: [actualExecution(0), actualExecution(HOUR_MS)],
      })
    ).toEqual([]);
  });
});
