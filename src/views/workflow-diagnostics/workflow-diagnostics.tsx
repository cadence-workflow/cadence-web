'use client';

import React from 'react';

import ErrorPanel from '@/components/error-panel/error-panel';
import PanelSection from '@/components/panel-section/panel-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import { type WorkflowPageTabContentProps } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import useSuspenseIsWorkflowDiagnosticsEnabled from '../workflow-page/hooks/use-is-workflow-diagnostics-enabled/use-suspense-is-workflow-diagnostics-enabled';

import workflowDiagnosticsDisabledErrorPanelConfig from './config/workflow-diagnostics-disabled-error-panel.config';
import useDiagnoseWorkflow from './hooks/use-diagnose-workflow/use-diagnose-workflow';
import WorkflowDiagnosticsContent from './workflow-diagnostics-content/workflow-diagnostics-content';
import WorkflowDiagnosticsFallback from './workflow-diagnostics-fallback/workflow-diagnostics-fallback';
import { styled } from './workflow-diagnostics.styles';

export default function WorkflowDiagnostics({
  params,
}: WorkflowPageTabContentProps) {
  const { data: isWorkflowDiagnosticsEnabled } =
    useSuspenseIsWorkflowDiagnosticsEnabled();

  const { data, error, status } = useDiagnoseWorkflow(params, {
    enabled: isWorkflowDiagnosticsEnabled,
  });

  if (!isWorkflowDiagnosticsEnabled) {
    return (
      <PanelSection>
        <ErrorPanel {...workflowDiagnosticsDisabledErrorPanelConfig} />
      </PanelSection>
    );
  }

  if (status === 'pending') {
    return <SectionLoadingIndicator />;
  }

  if (status === 'error') {
    throw error;
  }

  return (
    <styled.PageSection>
      {data.parsingError ? (
        <WorkflowDiagnosticsFallback
          {...params}
          diagnosticsResult={data.result}
        />
      ) : (
        <WorkflowDiagnosticsContent
          {...params}
          diagnosticsResult={data.result}
        />
      )}
    </styled.PageSection>
  );
}
