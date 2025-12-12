import { type CronListEnabledResolverParams } from './cron-list-enabled.types';

export default async function cronListEnabled(
  _: CronListEnabledResolverParams
): Promise<boolean> {
  // Check for environment variable override, default to false (disabled)
  return process.env.CRON_LIST_ENABLED?.toLowerCase() === 'true';
}
