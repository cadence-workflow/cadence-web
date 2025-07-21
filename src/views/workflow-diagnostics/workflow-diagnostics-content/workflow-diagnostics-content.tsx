'use client';

import React, { useMemo, useState } from 'react';

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

  const issuesGroupsWithEntries: Array<string> = useMemo(
    () =>
      Object.entries(diagnosticsResult.DiagnosticsResult)
        .map(([name, issuesGroup]) => {
          if (!issuesGroup) return null;
          if (issuesGroup.Issues.length === 0) return null;
          return name;
        })
        .filter((name) => name !== null) as Array<string>,
    [diagnosticsResult.DiagnosticsResult]
  );

  if (issuesGroupsWithEntries.length === 0) {
    // TODO: Add a No Issues Found panel
    return <div>No issues found with this workflow</div>;
  }

  return (
    <>
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
    </>
  );
}
