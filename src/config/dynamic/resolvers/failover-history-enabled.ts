/**
 * WIP: Returns whether failover history APIs and UI are enabled.
 *
 * To enable the failover history tab, set the CADENCE_FAILOVER_HISTORY_ENABLED env variable to true.
 * For further customization, override the implementation of this resolver.
 *
 * Server version behaviour:
 * - > 1.3.6 (still hasn't been released yet): The Failover History API will work as expected.
 * - <= 1.3.6: The Failover History API will return a GRPC unimplemented error (maps to HTTP 404 in the client).
 *
 * @returns {Promise<boolean>} Whether failover history UI is enabled.
 */
export default async function failoverHistoryEnabled(): Promise<boolean> {
  return process.env.CADENCE_FAILOVER_HISTORY_ENABLED === 'true';
}
