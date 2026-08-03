import { cronValidate } from './cron-validate';
import { type ParsedCronExpression } from './cron-validate.types';

export default function parseCronExpression(
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
