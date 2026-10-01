import { useMemo } from 'react';

import useConfigValue from '@/hooks/use-config-value/use-config-value';
import decodeUrlParams from '@/utils/decode-url-params';
import useDiagnoseWorkflow from '@/views/workflow-history/hooks/use-diagnose-workflow/use-diagnose-workflow';
import { type UseDiagnoseWorkflowParams } from '@/views/workflow-history/hooks/use-diagnose-workflow/use-diagnose-workflow.types';
import { useDescribeWorkflow } from '@/views/workflow-page/hooks/use-describe-workflow';

export default function useWorkflowDiagnosticsIssuesCount(
  params: UseDiagnoseWorkflowParams
): number | undefined {
  const { data: isWorkflowDiagnosticsEnabled } = useConfigValue(
    'WORKFLOW_DIAGNOSTICS_ENABLED'
  );

  const { data: isWorkflowDiagnosticsInHistoryEnabled } = useConfigValue(
    'WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED'
  );

  const { data: describeWorkflowResponse } = useDescribeWorkflow(params);

  const isWorkflowClosed = Boolean(
    describeWorkflowResponse?.workflowExecutionInfo &&
      describeWorkflowResponse.workflowExecutionInfo?.closeStatus &&
      describeWorkflowResponse.workflowExecutionInfo.closeStatus !==
        'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID'
  );

  const shouldEvaluateDiagnostics =
    (Boolean(isWorkflowDiagnosticsEnabled) && isWorkflowClosed) ||
    Boolean(isWorkflowDiagnosticsInHistoryEnabled);

  // Decoded to share the diagnose query cache with the workflow history view
  const { data: diagnoseWorkflowResponse } = useDiagnoseWorkflow(
    decodeUrlParams(params),
    { enabled: shouldEvaluateDiagnostics }
  );

  const totalIssuesCount = useMemo(() => {
    if (
      !shouldEvaluateDiagnostics ||
      !describeWorkflowResponse ||
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
  }, [
    shouldEvaluateDiagnostics,
    describeWorkflowResponse,
    diagnoseWorkflowResponse,
  ]);

  return totalIssuesCount;
}
