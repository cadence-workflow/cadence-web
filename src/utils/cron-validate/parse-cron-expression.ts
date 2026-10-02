import { cronValidate } from './cron-validate';
import { type ParsedCronExpression } from './cron-validate.types';

function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

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

  const timezonePrefix = timezoneMatch?.[1];
  const timezone =
    timezonePrefix && isValidTimezone(timezonePrefix) ? timezonePrefix : 'UTC';

  return {
    expression,
    timezone,
  };
}
