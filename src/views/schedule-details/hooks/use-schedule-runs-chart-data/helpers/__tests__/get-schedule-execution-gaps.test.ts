import { SKIPPED_INFERENCE_VISIBILITY_BUFFER_MS } from '../../use-schedule-runs-chart-data.constants';
import getScheduleExecutionGaps from '../get-schedule-execution-gaps';

const hourMs = 60 * 60_000;

describe(getScheduleExecutionGaps.name, () => {
  it('subtracts actual runs from expected cron occurrences', () => {
    expect(
      getScheduleExecutionGaps({
        cronExpression: '0 * * * *',
        timelineStartMs: 0,
        scheduleEndMs: null,
        oldestLoadedScheduleTimeMs: 0,
        hasNextPage: false,
        lastFetchedAtMs: 3 * hourMs,
        nowMs: 3 * hourMs,
        actualTimesMs: [hourMs, 3 * hourMs],
      })
    ).toEqual({
      skippedExecutions: [
        { scheduledTimeMs: 0 },
        { scheduledTimeMs: 2 * hourMs },
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
        // The runs page was last fetched two hours ago: slots at or shortly
        // before that boundary can't be confirmed skipped yet, since a run may
        // not have shown up in the response due to visibility indexing/poll lag.
        lastFetchedAtMs: 2 * hourMs,
        nowMs: 4 * hourMs,
        actualTimesMs: [hourMs],
      })
    ).toEqual({
      skippedExecutions: [{ scheduledTimeMs: 0 }],
      unconfirmedExecutions: [
        { scheduledTimeMs: 2 * hourMs },
        { scheduledTimeMs: 3 * hourMs },
        { scheduledTimeMs: 4 * hourMs },
      ],
    });
  });

  it('treats a slot within the visibility buffer before last fetch as unconfirmed', () => {
    const lastFetchedAtMs = 2 * hourMs;

    expect(
      getScheduleExecutionGaps({
        cronExpression: '0 * * * *',
        timelineStartMs: 0,
        scheduleEndMs: null,
        oldestLoadedScheduleTimeMs: 0,
        hasNextPage: false,
        lastFetchedAtMs,
        nowMs: lastFetchedAtMs,
        actualTimesMs: [hourMs],
      })
    ).toEqual({
      skippedExecutions: [{ scheduledTimeMs: 0 }],
      unconfirmedExecutions: [{ scheduledTimeMs: lastFetchedAtMs }],
    });
    expect(SKIPPED_INFERENCE_VISIBILITY_BUFFER_MS).toBe(2_000);
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
        nowMs: 2 * hourMs,
        actualTimesMs: [],
      })
    ).toEqual({
      skippedExecutions: [],
      unconfirmedExecutions: [
        { scheduledTimeMs: 0 },
        { scheduledTimeMs: hourMs },
        { scheduledTimeMs: 2 * hourMs },
      ],
    });
  });

  it('does not infer before the oldest loaded run while pages remain', () => {
    expect(
      getScheduleExecutionGaps({
        cronExpression: '0 * * * *',
        timelineStartMs: 0,
        scheduleEndMs: null,
        oldestLoadedScheduleTimeMs: 2 * hourMs,
        hasNextPage: true,
        lastFetchedAtMs: 4 * hourMs,
        nowMs: 4 * hourMs,
        actualTimesMs: [2 * hourMs],
      })
    ).toEqual({
      skippedExecutions: [{ scheduledTimeMs: 3 * hourMs }],
      unconfirmedExecutions: [{ scheduledTimeMs: 4 * hourMs }],
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
        lastFetchedAtMs: 4 * hourMs,
        nowMs: 4 * hourMs,
        actualTimesMs: [],
      })
    ).toEqual({ skippedExecutions: [], unconfirmedExecutions: [] });
  });

  it('respects the schedule end', () => {
    expect(
      getScheduleExecutionGaps({
        cronExpression: '0 * * * *',
        timelineStartMs: 0,
        scheduleEndMs: 2 * hourMs,
        oldestLoadedScheduleTimeMs: 0,
        hasNextPage: false,
        lastFetchedAtMs: 4 * hourMs,
        nowMs: 4 * hourMs,
        actualTimesMs: [hourMs],
      })
    ).toEqual({
      skippedExecutions: [
        { scheduledTimeMs: 0 },
        { scheduledTimeMs: 2 * hourMs },
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
        lastFetchedAtMs: hourMs,
        nowMs: hourMs,
        actualTimesMs: [hourMs, hourMs],
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
        lastFetchedAtMs: 2 * hourMs,
        nowMs: 2 * hourMs,
        nextExecutionTimeMs: 2 * hourMs,
        actualTimesMs: [0, hourMs],
      })
    ).toEqual({ skippedExecutions: [], unconfirmedExecutions: [] });
  });

  it('returns no gaps once the schedule has ended before the inferred start', () => {
    expect(
      getScheduleExecutionGaps({
        cronExpression: '0 * * * *',
        timelineStartMs: 2 * hourMs,
        scheduleEndMs: hourMs,
        oldestLoadedScheduleTimeMs: 0,
        hasNextPage: false,
        lastFetchedAtMs: 4 * hourMs,
        nowMs: 4 * hourMs,
        actualTimesMs: [],
      })
    ).toEqual({ skippedExecutions: [], unconfirmedExecutions: [] });
  });
});
