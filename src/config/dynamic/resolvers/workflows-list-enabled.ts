/**
 * Returns whether the new Workflows List page is enabled.
 *
 * To enable, set the CADENCE_WORKFLOWS_LIST_ENABLED env variable to `true`.
 *
 * For further customization, override the implementation of this resolver.
 *
 * @returns {Promise<boolean>} Whether the Workflows List page is enabled.
 */
export default async function workflowsListEnabled(): Promise<boolean> {
  return process.env.CADENCE_WORKFLOWS_LIST_ENABLED === 'true';
}
