/**
 * Returns whether the workflow home page (rendered from a Markdoc query) is enabled.
 *
 * To enable, set the CADENCE_WORKFLOW_HOME_ENABLED env variable to true.
 * For further customization, override the implementation of this resolver.
 *
 * @returns {Promise<boolean>} Whether the workflow home page is enabled.
 */
export default async function workflowHomeEnabled(): Promise<boolean> {
  return process.env.CADENCE_WORKFLOW_HOME_ENABLED === 'true';
}
