import HISTORY_PAGE_V2_ENABLED_VALUES_CONFIG from './history-page-v2-enabled-values.config';
import { type HistoryPageV2EnabledConfigValue } from './history-page-v2-enabled.types';

/**
 * WIP: Returns the configuration value for the new Workflow History (V2) page
 *
 * To configure the new Workflow History (V2) page, set the CADENCE_HISTORY_PAGE_V2_ENABLED env variable to one of the following:
 * - `DISABLED` - disable the feature entirely (default if env var is not set or invalid)
 * - `OPT_IN` - allow users to view the new page using a button on the old page
 * - `OPT_OUT` - default to the new page with an option to fall back to the old page
 * - `ENABLED` - completely enable the new page with no option to fall back
 *
 * For further customization, override the implementation of this resolver.
 *
 * @returns {Promise<HistoryPageV2EnabledConfigValue>} The configuration value for Workflow History (V2) page.
 */
export default async function historyPageV2Enabled(): Promise<HistoryPageV2EnabledConfigValue> {
  const envValue = process.env.CADENCE_HISTORY_PAGE_V2_ENABLED;

  if (HISTORY_PAGE_V2_ENABLED_VALUES_CONFIG.includes(envValue as any)) {
    return envValue as HistoryPageV2EnabledConfigValue;
  }

  return 'DISABLED';
}
