import { useCallback, useState } from 'react';

import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from '@/utils/local-storage';
import workflowHistoryUserPreferencesConfig from '@/views/workflow-history/config/workflow-history-user-preferences.config';

/**
 * Manages Workflow History V2 selected state based on config and localStorage.
 *
 * @returns A tuple containing:
 *   - `isWorkflowHistoryV2Selected`: boolean indicating whether Workflow History V2 is selected
 *   - `setIsWorkflowHistoryV2Selected`: function to update the selected state
 *
 * Behavior by config mode:
 * - `DISABLED`: Always returns `false`. Setter has no effect.
 * - `ENABLED`: Always returns `true`. Setter has no effect.
 * - `OPT_OUT`: Always starts with `true`. Setter updates state but does not persist to localStorage.
 * - `OPT_IN`: Reads initial state from localStorage (defaults to `false`). Setter updates both state and localStorage.
 */
export default function useIsWorkflowHistoryV2Selected(): [
  boolean,
  (v: boolean) => void,
] {
  const { data: historyPageV2Config } = useSuspenseConfigValue(
    'HISTORY_PAGE_V2_ENABLED'
  );

  const [isSelected, setIsSelected] = useState(() => {
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

  const setIsWorkflowHistoryV2Selected = useCallback(
    (v: boolean) => {
      if (
        historyPageV2Config === 'DISABLED' ||
        historyPageV2Config === 'ENABLED'
      ) {
        return;
      }

      setIsSelected(v);

      // We only save user preferences to localStorage for OPT_IN mode, not for OPT_OUT,
      // so that we can learn when users explicitly choose to stick with the old workflow history view.
      // This helps us gather feedback from those who opt to not try the new experience.
      if (historyPageV2Config === 'OPT_IN') {
        setLocalStorageValue(
          workflowHistoryUserPreferencesConfig.historyV2ViewEnabled.key,
          String(v)
        );
      }
    },
    [historyPageV2Config]
  );

  return [isSelected, setIsWorkflowHistoryV2Selected];
}
