/**
 * Returns whether partial matching is enabled when listing workflows.
 *
 * To enable, set the CADENCE_LIST_WORKFLOWS_PARTIAL_MATCH_ENABLED env variable to `true`.
 * For further customization, override the implementation of this resolver.
 *
 * Note: Partial matching only works when advanced visibility is enabled on the cluster.
 *
 * Server version behaviour:
 * - \>= 1.4.1: Partial matching when listing workflows will work as expected.
 *   Note: 1.4.1 is currently in prerelease.
 * - < 1.4.1: Partial matching is not supported by the server and should remain disabled.
 *
 * @returns {Promise<boolean>} Whether workflow partial matching is enabled.
 */
export default async function listWorkflowsPartialMatchEnabled(): Promise<boolean> {
  return process.env.CADENCE_LIST_WORKFLOWS_PARTIAL_MATCH_ENABLED === 'true';
}
