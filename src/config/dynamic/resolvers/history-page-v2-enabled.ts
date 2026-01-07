import HISTORY_PAGE_V2_ENABLED_VALUES_CONFIG from './history-page-v2-enabled-values.config';
import { type HistoryPageV2EnabledConfigValue } from './history-page-v2-enabled.types';

/**
 * WIP: Returns the configuration value for the new Workflow History (V2) page
 *
 * To configure the new Workflow History (V2) page, set the CADENCE_HISTORY_PAGE_V2_ENABLED env variable
 * to one of: 'DISABLED', 'OPT-OUT', 'OPT-IN', or 'ENABLED'.
 * For further customization, override the implementation of this resolver.
 *
 * @returns {Promise<HistoryPageV2EnabledConfigValue>} The configuration value for Workflow History (V2) page.
 */
export default async function historyPageV2Enabled(): Promise<HistoryPageV2EnabledConfigValue> {
  const envValue = process.env.CADENCE_HISTORY_PAGE_V2_ENABLED;

  if (HISTORY_PAGE_V2_ENABLED_VALUES_CONFIG.find((v) => v === envValue)) {
    return envValue as HistoryPageV2EnabledConfigValue;
  }

  return 'DISABLED';
}
