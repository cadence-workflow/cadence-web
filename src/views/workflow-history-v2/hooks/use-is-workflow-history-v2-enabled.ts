import { useCallback, useState } from 'react';

import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from '@/utils/local-storage';
import workflowHistoryUserPreferencesConfig from '@/views/workflow-history/config/workflow-history-user-preferences.config';

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
