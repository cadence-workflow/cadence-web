import { useMemo } from 'react';

import useConfigValue from '@/hooks/use-config-value/use-config-value';

import getDiagnosticsIssuesByEventId from '../helpers/get-diagnostics-issues-by-event-id';
import { type WorkflowHistoryPageContextType } from '../workflow-history.types';

import useDiagnoseWorkflow from './use-diagnose-workflow/use-diagnose-workflow';
import { type UseDiagnoseWorkflowParams } from './use-diagnose-workflow/use-diagnose-workflow.types';

export default function useWorkflowHistoryPageContext(
  params: UseDiagnoseWorkflowParams
): WorkflowHistoryPageContextType {
  const { data: isDiagnosticsInHistoryEnabled } = useConfigValue(
    'WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED'
  );

  const { data: workflowDiagnostics } = useDiagnoseWorkflow(params, {
    enabled: Boolean(isDiagnosticsInHistoryEnabled),
  });

  return useMemo(
    () => ({
      pageConfig: {
        WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED: Boolean(
          isDiagnosticsInHistoryEnabled
        ),
      },
      diagnosticsByEventId:
        workflowDiagnostics?.parsingError || !workflowDiagnostics?.result
          ? {}
          : getDiagnosticsIssuesByEventId(workflowDiagnostics.result),
    }),
    [isDiagnosticsInHistoryEnabled, workflowDiagnostics]
  );
}
