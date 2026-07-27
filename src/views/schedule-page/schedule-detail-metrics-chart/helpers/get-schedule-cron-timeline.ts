import { CronExpressionParser } from 'cron-parser';

import { type Duration } from '@/__generated__/proto-ts/google/protobuf/Duration';
import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';
import { cronValidate } from '@/utils/cron-validate/cron-validate';
import formatDurationToSeconds from '@/utils/data-formatters/format-duration-to-seconds';
import formatTimestampToDatetime from '@/utils/data-formatters/format-timestamp-to-datetime';

import { CHART_INITIAL_EXPECTED_RUN_COUNT } from '../schedule-detail-metrics-chart.constants';

export const MAX_SCHEDULE_CRON_OCCURRENCES = 10_000;

type ParsedCronExpression = {
  expression: string;
  timezone: string;
};

export type ScheduleTimelineBounds = {
  inferenceStartMs: number | null;
  navigationStartMs: number | null;
  scheduleEndMs: number | null;
};

function timestampToMs(
  timestamp:
    | { seconds: number | string; nanos: number | string }
    | null
    | undefined
): number | null {
  return formatTimestampToDatetime(timestamp)?.getTime() ?? null;
}

function parseScheduleCronExpression(
  cronExpression: string
): ParsedCronExpression | null {
  const timezoneMatch = cronExpression
    .trim()
    .match(/^CRON_TZ=([^\s]+)\s+(.+)$/);
  const expression = (timezoneMatch?.[2] ?? cronExpression).trim();

  if (!cronValidate(expression).isValid()) {
    return null;
  }

  return {
    expression,
    timezone: timezoneMatch?.[1] ?? 'UTC',
  };
}

export function getScheduleTimelineBounds({
  describeSchedule,
  retentionSeconds,
  nowMs,
}: {
  describeSchedule: DescribeScheduleResponse | undefined;
  retentionSeconds: number | null;
  nowMs: number;
}): ScheduleTimelineBounds {
  const createTimeMs = timestampToMs(describeSchedule?.info?.createTime);
  const lastUpdateTimeMs = timestampToMs(
    describeSchedule?.info?.lastUpdateTime
  );
  const specStartTimeMs = timestampToMs(describeSchedule?.spec?.startTime);
  const scheduleEndMs = timestampToMs(describeSchedule?.spec?.endTime);
  const retentionCutoffMs =
    retentionSeconds != null && Number.isFinite(retentionSeconds)
      ? nowMs - retentionSeconds * 1000
      : null;
  const navigationCandidates = [createTimeMs, retentionCutoffMs].filter(
    (value): value is number => value != null && Number.isFinite(value)
  );
  const inferenceCandidates = [
    ...navigationCandidates,
    lastUpdateTimeMs,
    specStartTimeMs,
  ].filter((value): value is number => value != null && Number.isFinite(value));

  return {
    navigationStartMs:
      navigationCandidates.length > 0
        ? Math.max(...navigationCandidates)
        : null,
    inferenceStartMs:
      inferenceCandidates.length > 0 ? Math.max(...inferenceCandidates) : null,
    scheduleEndMs,
  };
}

export function getDomainRetentionSeconds(
  retention: Pick<Duration, 'seconds'> | null | undefined
): number | null {
  return formatDurationToSeconds(retention);
}

export function getExpectedScheduleTimesMs({
  cronExpression,
  startMs,
  endMs,
  limit = MAX_SCHEDULE_CRON_OCCURRENCES,
}: {
  cronExpression: string;
  startMs: number;
  endMs: number;
  limit?: number;
}): number[] {
  const cron = parseScheduleCronExpression(cronExpression);

  if (
    !cron ||
    !Number.isFinite(startMs) ||
    !Number.isFinite(endMs) ||
    endMs < startMs
  ) {
    return [];
  }

  try {
    // Forward iteration is authoritative: walking backward across a DST
    // fall-back emits the repeated wall-clock time twice.
    const forwardInterval = CronExpressionParser.parse(cron.expression, {
      currentDate: startMs - 1,
      endDate: endMs,
      tz: cron.timezone,
    });
    const occurrences: number[] = [];

    while (occurrences.length <= limit) {
      try {
        occurrences.push(forwardInterval.next().toDate().getTime());
      } catch {
        break;
      }
    }

    if (occurrences.length <= limit) {
      return occurrences;
    }

    // ponytail: cap dense histories by walking backward; aggregate rendering can
    // replace this newest-N ceiling if the chart later needs every old slot.
    const backwardInterval = CronExpressionParser.parse(cron.expression, {
      currentDate: endMs + 1,
      startDate: startMs,
      tz: cron.timezone,
    });
    const latestOccurrences: number[] = [];

    while (latestOccurrences.length < limit) {
      try {
        const occurrenceMs = backwardInterval.prev().toDate().getTime();

        if (occurrenceMs < startMs) {
          break;
        }

        latestOccurrences.push(occurrenceMs);
      } catch {
        break;
      }
    }

    return latestOccurrences.reverse();
  } catch {
    return [];
  }
}

export function getLatestExpectedScheduleTimesMs({
  cronExpression,
  anchorMs,
  startMs,
  count = CHART_INITIAL_EXPECTED_RUN_COUNT,
}: {
  cronExpression: string;
  anchorMs: number;
  startMs?: number | null;
  count?: number;
}): number[] {
  const cron = parseScheduleCronExpression(cronExpression);

  if (!cron || !Number.isFinite(anchorMs)) {
    return [];
  }

  try {
    const interval = CronExpressionParser.parse(cron.expression, {
      currentDate: anchorMs + 1,
      startDate: startMs ?? undefined,
      tz: cron.timezone,
    });
    const occurrences: number[] = [];

    while (occurrences.length < count) {
      try {
        const occurrenceMs = interval.prev().toDate().getTime();

        if (startMs != null && occurrenceMs < startMs) {
          break;
        }

        occurrences.push(occurrenceMs);
      } catch {
        break;
      }
    }

    return occurrences.reverse();
  } catch {
    return [];
  }
}

export function getScheduleIntervalAfterMs({
  cronExpression,
  occurrenceMs,
}: {
  cronExpression: string;
  occurrenceMs: number;
}): number | null {
  const cron = parseScheduleCronExpression(cronExpression);

  if (!cron || !Number.isFinite(occurrenceMs)) {
    return null;
  }

  try {
    const nextMs = CronExpressionParser.parse(cron.expression, {
      currentDate: occurrenceMs,
      tz: cron.timezone,
    })
      .next()
      .toDate()
      .getTime();

    return nextMs > occurrenceMs ? nextMs - occurrenceMs : null;
  } catch {
    return null;
  }
}

export function getSkippedScheduleTimesMs({
  expectedTimesMs,
  actualTimesMs,
  jitterMs = 0,
}: {
  expectedTimesMs: number[];
  actualTimesMs: number[];
  jitterMs?: number;
}): number[] {
  const unmatchedActualTimesMs = [...actualTimesMs];
  const exactlyMatchedExpectedTimesMs = new Set<number>();

  expectedTimesMs.forEach((expectedTimeMs) => {
    const exactIndex = unmatchedActualTimesMs.indexOf(expectedTimeMs);

    if (exactIndex >= 0) {
      exactlyMatchedExpectedTimesMs.add(expectedTimeMs);
      unmatchedActualTimesMs.splice(exactIndex, 1);
    }
  });

  return expectedTimesMs.filter((expectedTimeMs) => {
    if (exactlyMatchedExpectedTimesMs.has(expectedTimeMs)) {
      return false;
    }

    const actualIndex = unmatchedActualTimesMs.findIndex(
      (actualTimeMs) =>
        jitterMs > 0 &&
        actualTimeMs > expectedTimeMs &&
        actualTimeMs < expectedTimeMs + jitterMs
    );

    if (actualIndex < 0) {
      return true;
    }

    unmatchedActualTimesMs.splice(actualIndex, 1);
    return false;
  });
}

export function getScheduleJitterMs(
  describeSchedule: DescribeScheduleResponse | undefined
): number {
  return (formatDurationToSeconds(describeSchedule?.spec?.jitter) ?? 0) * 1000;
}
