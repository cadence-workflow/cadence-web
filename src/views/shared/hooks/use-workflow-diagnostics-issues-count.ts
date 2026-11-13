import { useMemo } from 'react';

import useConfigValue from '@/hooks/use-config-value/use-config-value';
import decodeUrlParams from '@/utils/decode-url-params';
import useDiagnoseWorkflow from '@/views/workflow-history/hooks/use-diagnose-workflow/use-diagnose-workflow';
import { type UseDiagnoseWorkflowParams } from '@/views/workflow-history/hooks/use-diagnose-workflow/use-diagnose-workflow.types';

export default function useWorkflowDiagnosticsIssuesCount(
  params: UseDiagnoseWorkflowParams
): number | undefined {
  const { data: isWorkflowDiagnosticsEnabled } = useConfigValue(
    'WORKFLOW_DIAGNOSTICS_ENABLED'
  );

  // Decoded to share the diagnose query cache with the workflow history view
  const { data: diagnoseWorkflowResponse } = useDiagnoseWorkflow(
    decodeUrlParams(params),
    { enabled: Boolean(isWorkflowDiagnosticsEnabled) }
  );

  const totalIssuesCount = useMemo(() => {
    if (
      !isWorkflowDiagnosticsEnabled ||
      !diagnoseWorkflowResponse ||
      diagnoseWorkflowResponse.parsingError
    )
      return undefined;

    return Object.values(diagnoseWorkflowResponse.result.result).reduce(
      (numIssuesSoFar, issuesGroup) => {
        if (issuesGroup === null) return numIssuesSoFar;
        return numIssuesSoFar + issuesGroup.issues.length;
      },
      0
    );
  }, [isWorkflowDiagnosticsEnabled, diagnoseWorkflowResponse]);

  return totalIssuesCount;
}
