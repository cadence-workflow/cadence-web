export default async function cronListEnabled(): Promise<boolean> {
  // Check for environment variable override, default to false (disabled)
  return process.env.CRON_LIST_ENABLED?.toLowerCase() === 'true';
}
