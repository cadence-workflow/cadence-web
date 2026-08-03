import getScheduleExecutionGaps from '../get-schedule-execution-gaps';

const HOUR_MS = 60 * 60_000;

describe(getScheduleExecutionGaps.name, () => {
  it('subtracts actual runs from expected cron occurrences', () => {
    expect(
      getScheduleExecutionGaps({
        cronExpression: '0 * * * *',
        timelineStartMs: 0,
        scheduleEndMs: null,
        oldestLoadedScheduleTimeMs: 0,
        hasNextPage: false,
        lastFetchedAtMs: 3 * HOUR_MS,
        nowMs: 3 * HOUR_MS,
        actualTimesMs: [HOUR_MS, 3 * HOUR_MS],
      })
    ).toEqual({
      skippedExecutions: [
        { scheduledTimeMs: 0 },
        { scheduledTimeMs: 2 * HOUR_MS },
      ],
      unconfirmedExecutions: [],
    });
  });

  it('reports slots due after the last fetch as unconfirmed', () => {
    expect(
      getScheduleExecutionGaps({
        cronExpression: '0 * * * *',
        timelineStartMs: 0,
        scheduleEndMs: null,
        oldestLoadedScheduleTimeMs: 0,
        hasNextPage: false,
        // The runs page was last fetched two hours ago: slots strictly after
        // that can't be confirmed skipped yet, since a run may not have
        // shown up in the response due to visibility indexing/poll lag.
        lastFetchedAtMs: 2 * HOUR_MS,
        nowMs: 4 * HOUR_MS,
        actualTimesMs: [HOUR_MS],
      })
    ).toEqual({
      skippedExecutions: [
        { scheduledTimeMs: 0 },
        { scheduledTimeMs: 2 * HOUR_MS },
      ],
      unconfirmedExecutions: [
        { scheduledTimeMs: 3 * HOUR_MS },
        { scheduledTimeMs: 4 * HOUR_MS },
      ],
    });
  });

  it('treats a missing fetch timestamp as fully unconfirmed', () => {
    expect(
      getScheduleExecutionGaps({
        cronExpression: '0 * * * *',
        timelineStartMs: 0,
        scheduleEndMs: null,
        oldestLoadedScheduleTimeMs: 0,
        hasNextPage: false,
        lastFetchedAtMs: null,
        nowMs: 2 * HOUR_MS,
        actualTimesMs: [],
      })
    ).toEqual({
      skippedExecutions: [],
      unconfirmedExecutions: [
        { scheduledTimeMs: 0 },
        { scheduledTimeMs: HOUR_MS },
        { scheduledTimeMs: 2 * HOUR_MS },
      ],
    });
  });

  it('does not infer before the oldest loaded run while pages remain', () => {
    expect(
      getScheduleExecutionGaps({
        cronExpression: '0 * * * *',
        timelineStartMs: 0,
        scheduleEndMs: null,
        oldestLoadedScheduleTimeMs: 2 * HOUR_MS,
        hasNextPage: true,
        lastFetchedAtMs: 4 * HOUR_MS,
        nowMs: 4 * HOUR_MS,
        actualTimesMs: [2 * HOUR_MS],
      })
    ).toEqual({
      skippedExecutions: [
        { scheduledTimeMs: 3 * HOUR_MS },
        { scheduledTimeMs: 4 * HOUR_MS },
      ],
      unconfirmedExecutions: [],
    });
  });

  it('renders nothing for the whole window when the loaded boundary is unknown', () => {
    expect(
      getScheduleExecutionGaps({
        cronExpression: '0 * * * *',
        timelineStartMs: 0,
        scheduleEndMs: null,
        oldestLoadedScheduleTimeMs: null,
        hasNextPage: true,
        lastFetchedAtMs: 4 * HOUR_MS,
        nowMs: 4 * HOUR_MS,
        actualTimesMs: [],
      })
    ).toEqual({ skippedExecutions: [], unconfirmedExecutions: [] });
  });

  it('respects the schedule end', () => {
    expect(
      getScheduleExecutionGaps({
        cronExpression: '0 * * * *',
        timelineStartMs: 0,
        scheduleEndMs: 2 * HOUR_MS,
        oldestLoadedScheduleTimeMs: 0,
        hasNextPage: false,
        lastFetchedAtMs: 4 * HOUR_MS,
        nowMs: 4 * HOUR_MS,
        actualTimesMs: [HOUR_MS],
      })
    ).toEqual({
      skippedExecutions: [
        { scheduledTimeMs: 0 },
        { scheduledTimeMs: 2 * HOUR_MS },
      ],
      unconfirmedExecutions: [],
    });
  });

  it('does not treat a duplicated actual time as covering another slot', () => {
    expect(
      getScheduleExecutionGaps({
        cronExpression: '0 * * * *',
        timelineStartMs: 0,
        scheduleEndMs: null,
        oldestLoadedScheduleTimeMs: 0,
        hasNextPage: false,
        lastFetchedAtMs: HOUR_MS,
        nowMs: HOUR_MS,
        actualTimesMs: [HOUR_MS, HOUR_MS],
      })
    ).toEqual({
      skippedExecutions: [{ scheduledTimeMs: 0 }],
      unconfirmedExecutions: [],
    });
  });

  it('does not render a skipped marker for the reported next execution', () => {
    expect(
      getScheduleExecutionGaps({
        cronExpression: '0 * * * *',
        timelineStartMs: 0,
        scheduleEndMs: null,
        oldestLoadedScheduleTimeMs: 0,
        hasNextPage: false,
        lastFetchedAtMs: 2 * HOUR_MS,
        nowMs: 2 * HOUR_MS,
        nextExecutionTimeMs: 2 * HOUR_MS,
        actualTimesMs: [0, HOUR_MS],
      })
    ).toEqual({ skippedExecutions: [], unconfirmedExecutions: [] });
  });

  it('returns no gaps once the schedule has ended before the inferred start', () => {
    expect(
      getScheduleExecutionGaps({
        cronExpression: '0 * * * *',
        timelineStartMs: 2 * HOUR_MS,
        scheduleEndMs: HOUR_MS,
        oldestLoadedScheduleTimeMs: 0,
        hasNextPage: false,
        lastFetchedAtMs: 4 * HOUR_MS,
        nowMs: 4 * HOUR_MS,
        actualTimesMs: [],
      })
    ).toEqual({ skippedExecutions: [], unconfirmedExecutions: [] });
  });
});
