import { useMemo } from 'react';

import useConfigValue from '@/hooks/use-config-value/use-config-value';

import workflowHistoryFiltersConfig from '../config/workflow-history-filters.config';

export default function useEnabledWorkflowHistoryFiltersConfig(): Array<
  (typeof workflowHistoryFiltersConfig)[number]
> {
  const { data: isDiagnosticsInHistoryEnabled } = useConfigValue(
    'WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED'
  );

  return useMemo(
    () =>
      workflowHistoryFiltersConfig.filter(
        (f) => isDiagnosticsInHistoryEnabled || f.id !== 'historyEventIssues'
      ),
    [isDiagnosticsInHistoryEnabled]
  );
}
