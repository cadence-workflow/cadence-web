import { CronExpressionParser } from 'cron-parser';

import parseCronExpression from '@/utils/cron-validate/parse-cron-expression';

import { MAX_SCHEDULE_CRON_OCCURRENCES } from '../use-schedule-runs-chart-data.constants';
import { type GetExpectedScheduleTimesMsParams } from '../use-schedule-runs-chart-data.types';

export default function getExpectedScheduleTimesMs({
  cronExpression,
  startMs,
  endMs,
  limit = MAX_SCHEDULE_CRON_OCCURRENCES,
}: GetExpectedScheduleTimesMsParams): number[] {
  const cron = parseCronExpression(cronExpression);

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
