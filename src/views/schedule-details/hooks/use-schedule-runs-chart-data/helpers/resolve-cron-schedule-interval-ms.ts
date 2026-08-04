import { CronExpressionParser } from 'cron-parser';

import { cronValidate } from '@/utils/cron-validate/cron-validate';

export default function resolveCronScheduleIntervalMs(
  cronExpression: string,
  nowMs: number
): number | null {
  if (!cronValidate(cronExpression).isValid() || !Number.isFinite(nowMs)) {
    return null;
  }

  try {
    const cronInterval = CronExpressionParser.parse(cronExpression, {
      currentDate: nowMs,
      tz: 'UTC',
    });
    const nextOccurrenceMs = cronInterval.next().toDate().getTime();
    const followingOccurrenceMs = cronInterval.next().toDate().getTime();
    const intervalMs = followingOccurrenceMs - nextOccurrenceMs;

    return intervalMs > 0 ? intervalMs : null;
  } catch {
    return null;
  }
}
