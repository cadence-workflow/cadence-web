'use client';

import React, { useMemo, useState } from 'react';

import Image from 'next/image';

import circleCheck from '@/assets/circle-check.svg';
import PanelSection from '@/components/panel-section/panel-section';

import WorkflowDiagnosticsJson from '../workflow-diagnostics-json/workflow-diagnostics-json';
import WorkflowDiagnosticsList from '../workflow-diagnostics-list/workflow-diagnostics-list';
import WorkflowDiagnosticsViewToggle from '../workflow-diagnostics-view-toggle/workflow-diagnostics-view-toggle';
import { type DiagnosticsViewMode } from '../workflow-diagnostics-view-toggle/workflow-diagnostics-view-toggle.types';

import { styled } from './workflow-diagnostics-content.styles';
import { type Props } from './workflow-diagnostics-content.types';

export default function WorkflowDiagnosticsContent({
  domain,
  cluster,
  workflowId,
  runId,
  diagnosticsResult,
}: Props) {
  const [activeView, setActiveView] = useState<DiagnosticsViewMode>('list');

  const nonEmptyIssueGroups: Array<string> = useMemo(
    () =>
      Object.entries(diagnosticsResult.result)
        .map(([name, issuesGroup]) => {
          if (!issuesGroup) return null;
          if (issuesGroup.issues.length === 0) return null;
          return name;
        })
        .filter((name) => name !== null) as Array<string>,
    [diagnosticsResult.result]
  );

  if (nonEmptyIssueGroups.length === 0) {
    return (
      <PanelSection>
        <styled.NoIssuesContainer>
          <Image width={64} height={64} alt="No issues" src={circleCheck} />
          <styled.NoIssuesText>
            No issues found with this workflow
          </styled.NoIssuesText>
        </styled.NoIssuesContainer>
      </PanelSection>
    );
  }

  return (
    <styled.PageSection>
      <styled.ButtonsContainer>
        <WorkflowDiagnosticsViewToggle
          listEnabled
          activeView={activeView}
          setActiveView={setActiveView}
        />
        {/* TODO: Add a button here to expand all diagnostics issues, hide in JSON mode ofc */}
      </styled.ButtonsContainer>
      {activeView === 'list' ? (
        <WorkflowDiagnosticsList
          domain={domain}
          cluster={cluster}
          workflowId={workflowId}
          runId={runId}
          diagnosticsResult={diagnosticsResult}
        />
      ) : (
        <WorkflowDiagnosticsJson
          workflowId={workflowId}
          runId={runId}
          diagnosticsResult={diagnosticsResult}
        />
      )}
    </styled.PageSection>
  );
}
