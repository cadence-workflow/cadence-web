import { toString as cronToString } from 'cronstrue';

import parseCronExpression from '@/utils/cron-validate/parse-cron-expression';

export function formatScheduleCronExpression(
  cronExpression: string | null | undefined
) {
  if (!cronExpression) {
    return null;
  }

  const parsed = parseCronExpression(cronExpression);

  if (!parsed) {
    return cronExpression;
  }

  try {
    return `${cronToString(parsed.expression)} (${parsed.expression}), ${parsed.timezone}`;
  } catch {
    return cronExpression;
  }
}
