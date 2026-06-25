import { toString as cronToString } from 'cronstrue';

export function formatScheduleCronExpression(
  cronExpression: string | null | undefined
) {
  if (!cronExpression) {
    return null;
  }

  try {
    return `${cronToString(cronExpression)} (${cronExpression})`;
  } catch {
    return cronExpression;
  }
}
