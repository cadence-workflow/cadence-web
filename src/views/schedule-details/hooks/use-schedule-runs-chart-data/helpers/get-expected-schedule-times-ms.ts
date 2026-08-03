import { CronExpressionParser } from 'cron-parser';

import { cronValidate } from '@/utils/cron-validate/cron-validate';

import { type GetExpectedScheduleTimesMsParams } from '../use-schedule-runs-chart-data.types';

import { MAX_SCHEDULE_CRON_OCCURRENCES } from './get-expected-schedule-times-ms.constants';

export default function getExpectedScheduleTimesMs({
  cronExpression,
  startMs,
  endMs,
  limit = MAX_SCHEDULE_CRON_OCCURRENCES,
}: GetExpectedScheduleTimesMsParams): number[] {
  if (
    !cronValidate(cronExpression).isValid() ||
    !Number.isFinite(startMs) ||
    !Number.isFinite(endMs) ||
    endMs < startMs
  ) {
    return [];
  }

  try {
    // Cadence schedule cron expressions are always evaluated in UTC.
    const forwardInterval = CronExpressionParser.parse(cronExpression, {
      currentDate: startMs - 1,
      endDate: endMs,
      tz: 'UTC',
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

    const backwardInterval = CronExpressionParser.parse(cronExpression, {
      currentDate: endMs + 1,
      startDate: startMs,
      tz: 'UTC',
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
