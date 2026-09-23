import useConfigValue from '@/hooks/use-config-value/use-config-value';

import workflowHistoryFiltersWithIssuesConfig from '../config/workflow-history-filters-with-issues.config';
import workflowHistoryFiltersConfig from '../config/workflow-history-filters.config';

export default function useWorkflowHistoryFiltersConfig() {
  const { data: isDiagnosticsInHistoryEnabled } = useConfigValue(
    'WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED'
  );

  return isDiagnosticsInHistoryEnabled
    ? workflowHistoryFiltersWithIssuesConfig
    : workflowHistoryFiltersConfig;
}
