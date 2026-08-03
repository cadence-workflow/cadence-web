import {
  type GetScheduleExecutionGapsParams,
  type ScheduleExecutionGaps,
} from '../use-schedule-runs-chart-data.types';

import getExpectedScheduleTimesMs from './get-expected-schedule-times-ms';

export default function getScheduleExecutionGaps({
  cronExpression,
  scheduleStartMs,
  scheduleEndMs,
  oldestLoadedScheduleTimeMs,
  hasNextPage,
  lastFetchedAtMs,
  nowMs,
  nextExecutionTimeMs,
  actualTimesMs,
}: GetScheduleExecutionGapsParams): ScheduleExecutionGaps {
  const noGaps: ScheduleExecutionGaps = {
    skippedExecutions: [],
    unconfirmedExecutions: [],
  };

  if (scheduleStartMs == null) {
    return noGaps;
  }

  const trustworthyEndMs =
    scheduleEndMs == null ? nowMs : Math.min(nowMs, scheduleEndMs);

  if (trustworthyEndMs < scheduleStartMs) {
    return noGaps;
  }

  // Older runs may still be on unfetched pages, and there's no automatic
  // pagination to ever resolve that. Anything before the oldest loaded run -
  // or the whole window, if even that boundary is unknown - can't be diffed
  // against real data, so it's left unrendered rather than guessed at.
  const knownStartMs = !hasNextPage
    ? scheduleStartMs
    : Math.max(
        scheduleStartMs,
        oldestLoadedScheduleTimeMs ?? trustworthyEndMs + 1
      );

  // A slot due after our last successful fetch may already have a real run
  // that just hasn't shown up yet (visibility indexing/poll lag), so it's
  // reported as unconfirmed until a later fetch confirms it either way. With no
  // fetch to anchor on at all, nothing is confirmed.
  const knownEndMs =
    lastFetchedAtMs == null
      ? knownStartMs - 1
      : Math.min(trustworthyEndMs, lastFetchedAtMs);

  const coveredTimesMs = new Set([
    ...actualTimesMs,
    ...(nextExecutionTimeMs == null ? [] : [nextExecutionTimeMs]),
  ]);
  const skippedExecutions: ScheduleExecutionGaps['skippedExecutions'] = [];
  const unconfirmedExecutions: ScheduleExecutionGaps['unconfirmedExecutions'] =
    [];

  for (const scheduledTimeMs of getExpectedScheduleTimesMs({
    cronExpression,
    startMs: scheduleStartMs,
    endMs: trustworthyEndMs,
  })) {
    if (scheduledTimeMs < knownStartMs) {
      continue;
    }

    if (scheduledTimeMs > knownEndMs) {
      unconfirmedExecutions.push({ scheduledTimeMs });
    } else if (!coveredTimesMs.has(scheduledTimeMs)) {
      skippedExecutions.push({ scheduledTimeMs });
    }
  }

  return { skippedExecutions, unconfirmedExecutions };
}
