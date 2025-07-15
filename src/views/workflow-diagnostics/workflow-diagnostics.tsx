'use client';

import React from 'react';

import ErrorPanel from '@/components/error-panel/error-panel';
import PanelSection from '@/components/panel-section/panel-section';
import { type WorkflowPageTabContentProps } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import useSuspenseIsWorkflowDiagnosticsEnabled from '../workflow-page/hooks/use-is-workflow-diagnostics-enabled/use-suspense-is-workflow-diagnostics-enabled';

import workflowDiagnosticsDisabledErrorPanelConfig from './config/workflow-diagnostics-disabled-error-panel.config';
import WorkflowDiagnosticsContent from './workflow-diagnostics-content/workflow-diagnostics-content';

export default function WorkflowDiagnostics({
  params,
}: WorkflowPageTabContentProps) {
  const { data: isWorkflowDiagnosticsEnabled } =
    useSuspenseIsWorkflowDiagnosticsEnabled();

  if (!isWorkflowDiagnosticsEnabled) {
    return (
      <PanelSection>
        <ErrorPanel {...workflowDiagnosticsDisabledErrorPanelConfig} />
      </PanelSection>
    );
  }

  return <WorkflowDiagnosticsContent {...params} />;
}
