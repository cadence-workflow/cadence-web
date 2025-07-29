'use client';

import React from 'react';

import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import { type WorkflowPageTabContentProps } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import { useSuspenseDescribeWorkflow } from '../workflow-page/hooks/use-describe-workflow';
import useSuspenseIsWorkflowDiagnosticsEnabled from '../workflow-page/hooks/use-is-workflow-diagnostics-enabled/use-suspense-is-workflow-diagnostics-enabled';

import useDiagnoseWorkflow from './hooks/use-diagnose-workflow/use-diagnose-workflow';
import WorkflowDiagnosticsContent from './workflow-diagnostics-content/workflow-diagnostics-content';
import WorkflowDiagnosticsFallback from './workflow-diagnostics-fallback/workflow-diagnostics-fallback';
import {
  DIAGNOSTICS_CONFIG_DISABLED_ERROR_MSG,
  DIAGNOSTICS_RUNNING_WORKFLOW_ERROR_MSG,
} from './workflow-diagnostics.constants';

export default function WorkflowDiagnostics({
  params,
}: WorkflowPageTabContentProps) {
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

  const { data, status } = useDiagnoseWorkflow(params, {
    enabled: isWorkflowDiagnosticsEnabled && isWorkflowClosed,
    throwOnError: true,
  });

  if (!isWorkflowDiagnosticsEnabled) {
    throw new Error(DIAGNOSTICS_CONFIG_DISABLED_ERROR_MSG);
  }

  if (!isWorkflowClosed) {
    throw new Error(DIAGNOSTICS_RUNNING_WORKFLOW_ERROR_MSG);
  }

  if (status === 'pending') {
    return <SectionLoadingIndicator />;
  }

  if (!data) {
    throw new Error(
      'Unreachable case, react-query should have thrown error above'
    );
  }

  return data.parsingError ? (
    <WorkflowDiagnosticsFallback {...params} diagnosticsResult={data.result} />
  ) : (
    <WorkflowDiagnosticsContent {...params} diagnosticsResult={data.result} />
  );
}
