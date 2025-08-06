import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import useDiagnoseWorkflow from '@/views/workflow-diagnostics/hooks/use-diagnose-workflow/use-diagnose-workflow';
import { type UseDiagnoseWorkflowParams } from '@/views/workflow-diagnostics/hooks/use-diagnose-workflow/use-diagnose-workflow.types';
import { useDescribeWorkflow } from '@/views/workflow-page/hooks/use-describe-workflow';
import getIsWorkflowDiagnosticsEnabledQueryOptions from '@/views/workflow-page/hooks/use-is-workflow-diagnostics-enabled/get-is-workflow-diagnostics-enabled-query-options';

export default function useWorkflowDiagnosticsIssuesCount(
  params: UseDiagnoseWorkflowParams
): number | undefined {
  const { data: isWorkflowDiagnosticsEnabled } = useQuery(
    getIsWorkflowDiagnosticsEnabledQueryOptions()
  );

  const { data: describeWorkflowResponse } = useDescribeWorkflow(params);

  const isWorkflowClosed = Boolean(
    describeWorkflowResponse?.workflowExecutionInfo &&
      describeWorkflowResponse.workflowExecutionInfo?.closeStatus &&
      describeWorkflowResponse.workflowExecutionInfo.closeStatus !==
        'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID'
  );

  const { data: diagnoseWorkflowResponse } = useDiagnoseWorkflow(params, {
    enabled: isWorkflowDiagnosticsEnabled && isWorkflowClosed,
  });

  const totalIssuesCount = useMemo(() => {
    if (
      !isWorkflowDiagnosticsEnabled ||
      !describeWorkflowResponse ||
      !isWorkflowClosed ||
      !diagnoseWorkflowResponse ||
      diagnoseWorkflowResponse?.parsingError
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
    describeWorkflowResponse,
    isWorkflowDiagnosticsEnabled,
    isWorkflowClosed,
    diagnoseWorkflowResponse,
  ]);

  return totalIssuesCount;
}
