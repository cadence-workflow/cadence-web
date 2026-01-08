import { useCallback, useState } from 'react';

import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from '@/utils/local-storage';
import workflowHistoryUserPreferencesConfig from '@/views/workflow-history/config/workflow-history-user-preferences.config';

/**
 * Manages Workflow History V2 enabled state based on config and localStorage.
 *
 * @returns A tuple containing:
 *   - `isWorkflowHistoryV2Enabled`: boolean indicating whether Workflow History V2 is enabled
 *   - `setIsWorkflowHistoryV2Enabled`: function to update the enabled state
 *
 * Behavior by config mode:
 * - `DISABLED`: Always returns `false`. Setter has no effect.
 * - `ENABLED`: Always returns `true`. Setter has no effect.
 * - `OPT_OUT`: Always starts with `true`. Setter updates state but does not persist to localStorage.
 * - `OPT_IN`: Reads initial state from localStorage (defaults to `false`). Setter updates both state and localStorage.
 */
export default function useIsWorkflowHistoryV2Enabled(): [
  boolean,
  (v: boolean) => void,
] {
  const { data: historyPageV2Config } = useSuspenseConfigValue(
    'HISTORY_PAGE_V2_ENABLED'
  );

  const [isEnabled, setIsEnabled] = useState(() => {
    switch (historyPageV2Config) {
      case 'DISABLED':
        return false;
      case 'ENABLED':
      case 'OPT_OUT':
        return true;
      case 'OPT_IN':
        const userPreference = getLocalStorageValue(
          workflowHistoryUserPreferencesConfig.historyV2ViewEnabled.key,
          workflowHistoryUserPreferencesConfig.historyV2ViewEnabled.schema
        );
        return userPreference ?? false;
    }
  });

  const setIsWorkflowHistoryV2Enabled = useCallback(
    (v: boolean) => {
      if (
        historyPageV2Config === 'DISABLED' ||
        historyPageV2Config === 'ENABLED'
      ) {
        return;
      }

      setIsEnabled(v);

      if (historyPageV2Config === 'OPT_IN') {
        setLocalStorageValue(
          workflowHistoryUserPreferencesConfig.historyV2ViewEnabled.key,
          String(v)
        );
      }
    },
    [historyPageV2Config]
  );

  return [isEnabled, setIsWorkflowHistoryV2Enabled];
}
