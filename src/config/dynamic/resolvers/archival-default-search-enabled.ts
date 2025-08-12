export default async function archivalDefaultSearchEnabled(): Promise<boolean> {
  const enabled =
    process.env.CADENCE_ARCHIVAL_DEFAULT_SEARCH_ENABLED === 'true';

  return enabled;
}
