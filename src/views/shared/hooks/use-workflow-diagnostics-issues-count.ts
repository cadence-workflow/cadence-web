import { useMemo } from 'react';

import useDiagnoseWorkflow from '@/views/workflow-diagnostics/hooks/use-diagnose-workflow/use-diagnose-workflow';
import { type UseDiagnoseWorkflowParams } from '@/views/workflow-diagnostics/hooks/use-diagnose-workflow/use-diagnose-workflow.types';
import { useSuspenseDescribeWorkflow } from '@/views/workflow-page/hooks/use-describe-workflow';
import useSuspenseIsWorkflowDiagnosticsEnabled from '@/views/workflow-page/hooks/use-is-workflow-diagnostics-enabled/use-suspense-is-workflow-diagnostics-enabled';

export default function useWorkflowDiagnosticsIssuesCount(
  params: UseDiagnoseWorkflowParams
): number | undefined {
  const { data: isWorkflowDiagnosticsEnabled } =
    useSuspenseIsWorkflowDiagnosticsEnabled();

  const {
    data: { workflowExecutionInfo },
  } = useSuspenseDescribeWorkflow(params);

  const isWorkflowClosed = Boolean(
    workflowExecutionInfo?.closeStatus &&
      workflowExecutionInfo.closeStatus !==
        'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID'
  );

  const { data } = useDiagnoseWorkflow(params, {
    enabled: isWorkflowDiagnosticsEnabled && isWorkflowClosed,
  });

  const totalIssuesCount = useMemo(() => {
    if (
      !isWorkflowDiagnosticsEnabled ||
      !isWorkflowClosed ||
      !data ||
      data?.parsingError
    )
      return undefined;

    return Object.values(data.result.result).reduce(
      (numIssuesSoFar, issuesGroup) => {
        if (issuesGroup === null) return numIssuesSoFar;
        return numIssuesSoFar + issuesGroup.issues.length;
      },
      0
    );
  }, [isWorkflowDiagnosticsEnabled, isWorkflowClosed, data]);

  return totalIssuesCount;
}
