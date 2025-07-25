'use client';

import React, { useMemo, useState } from 'react';

import { Button } from 'baseui/button';
import Image from 'next/image';
import { MdUnfoldLess, MdUnfoldMore } from 'react-icons/md';

import circleCheck from '@/assets/circle-check.svg';
import PanelSection from '@/components/panel-section/panel-section';
import useExpansionToggle from '@/hooks/use-expansion-toggle/use-expansion-toggle';

import WorkflowDiagnosticsJson from '../workflow-diagnostics-json/workflow-diagnostics-json';
import WorkflowDiagnosticsList from '../workflow-diagnostics-list/workflow-diagnostics-list';
import WorkflowDiagnosticsViewToggle from '../workflow-diagnostics-view-toggle/workflow-diagnostics-view-toggle';
import { type DiagnosticsViewMode } from '../workflow-diagnostics-view-toggle/workflow-diagnostics-view-toggle.types';

import { styled } from './workflow-diagnostics-content.styles';
import {
  type IssueExpansionID,
  type Props,
} from './workflow-diagnostics-content.types';

export default function WorkflowDiagnosticsContent({
  diagnosticsResult,
  ...workflowPageParams
}: Props) {
  const [activeView, setActiveView] = useState<DiagnosticsViewMode>('list');

  const issuesGroups = useMemo(
    () => Object.entries(diagnosticsResult.result),
    [diagnosticsResult.result]
  );

  const nonEmptyIssuesGroups: Array<string> = useMemo(
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

  const allIssueExpansionIds = useMemo(
    () =>
      issuesGroups
        .map(
          ([groupName, issuesGroup]) =>
            issuesGroup?.issues.map(
              ({ issueId }): IssueExpansionID => `${groupName}.${issueId}`
            ) ?? []
        )
        .flat(1),
    [issuesGroups]
  );

  const {
    areAllItemsExpanded,
    toggleAreAllItemsExpanded,
    getIsItemExpanded,
    toggleIsItemExpanded,
  } = useExpansionToggle<IssueExpansionID>({
    items: allIssueExpansionIds,
    initialState: {},
  });

  if (nonEmptyIssuesGroups.length === 0) {
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
        <Button
          size="compact"
          kind="secondary"
          onClick={() => toggleAreAllItemsExpanded()}
          endEnhancer={
            areAllItemsExpanded ? (
              <MdUnfoldLess size={16} />
            ) : (
              <MdUnfoldMore size={16} />
            )
          }
        >
          {areAllItemsExpanded ? 'Collapse all' : 'Expand all'}
        </Button>
      </styled.ButtonsContainer>
      {activeView === 'list' ? (
        <WorkflowDiagnosticsList
          {...workflowPageParams}
          diagnosticsIssuesGroups={issuesGroups}
          getIsIssueExpanded={getIsItemExpanded}
          toggleIsIssueExpanded={toggleIsItemExpanded}
        />
      ) : (
        <WorkflowDiagnosticsJson
          workflowId={workflowPageParams.workflowId}
          runId={workflowPageParams.runId}
          diagnosticsResult={diagnosticsResult}
        />
      )}
    </styled.PageSection>
  );
}
