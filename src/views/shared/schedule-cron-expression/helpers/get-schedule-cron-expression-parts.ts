import { toString as cronToString } from 'cronstrue';

import parseCronExpression from '@/utils/cron-validate/parse-cron-expression';

import { type ScheduleCronExpressionParts } from '../schedule-cron-expression.types';

export default function getScheduleCronExpressionParts(
  cronExpression: string
): ScheduleCronExpressionParts | null {
  const parsed = parseCronExpression(cronExpression);

  if (!parsed) {
    return null;
  }

  try {
    return {
      expression: parsed.expression,
      description: cronToString(parsed.expression, {
        use24HourTimeFormat: true,
      }),
      timezone: parsed.timezone,
    };
  } catch {
    return null;
  }
}
