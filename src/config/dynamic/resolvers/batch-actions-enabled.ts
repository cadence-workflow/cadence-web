/**
 * Returns whether the Batch Actions feature is enabled.
 *
 * To enable, set the CADENCE_BATCH_ACTIONS_ENABLED env variable to `true`.
 *
 * For further customization, override the implementation of this resolver.
 *
 * @returns {Promise<boolean>} Whether the Batch Actions feature is enabled.
 */
export default async function batchActionsEnabled(): Promise<boolean> {
  return process.env.CADENCE_BATCH_ACTIONS_ENABLED === 'true';
}
