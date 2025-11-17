/**
 * WIP: Returns whether the new Workflow History (V2) page is enabled
 *
 * To enable the new Workflow History (V2) page, set the CADENCE_HISTORY_PAGE_V2_ENABLED env variable to true.
 * For further customization, override the implementation of this resolver.
 *
 * @returns {Promise<boolean>} Whether Workflow History (V2) page is enabled.
 */
export default async function historyPageV2Enabled(): Promise<boolean> {
  return process.env.CADENCE_HISTORY_PAGE_V2_ENABLED === 'true';
}
