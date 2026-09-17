import { mergeOverrides } from 'baseui';
import {
  Panel,
  type SharedStylePropsArg as AccordionStyledComponentProps,
} from 'baseui/accordion';
import { Button } from 'baseui/button';
import { MdArrowDropDown, MdArrowDropUp, MdOpenInNew } from 'react-icons/md';
import { RiStethoscopeLine } from 'react-icons/ri';

import WorkflowDiagnosticsMetadataTable from '@/views/workflow-diagnostics/workflow-diagnostics-metadata-table/workflow-diagnostics-metadata-table';

import { overrides, styled } from './workflow-history-event-diagnostics.styles';
import { type Props } from './workflow-history-event-diagnostics.types';

export default function WorkflowHistoryEventDiagnostics({
  issues,
  getIsIssueExpanded,
  toggleIsIssueExpanded,
  ...workflowPageParams
}: Props) {
  if (issues.length === 0) {
    return null;
  }

  return (
    <styled.Container>
      {issues.map((issue) => {
        const issueExpansionId = `${issue.invariantType}.${issue.issueId}`;
        return (
          <styled.IssueContainer key={issueExpansionId}>
            <Panel
              overrides={mergeOverrides(overrides.panel, {
                ToggleIcon: {
                  component: ({ $expanded }: AccordionStyledComponentProps) => (
                    <Button
                      size="compact"
                      kind="secondary"
                      shape="rounded"
                      endEnhancer={
                        $expanded ? <MdArrowDropUp /> : <MdArrowDropDown />
                      }
                      overrides={overrides.button}
                    >
                      Details
                    </Button>
                  ),
                },
              })}
              title={
                <styled.IssueHeader>
                  <styled.IssueHeaderSection>
                    <styled.IssueHeaderIconContainer>
                      <RiStethoscopeLine size={18} />
                    </styled.IssueHeaderIconContainer>
                    <styled.IssueHeaderText>
                      <styled.IssueType>{issue.invariantType}</styled.IssueType>
                      <styled.IssueReason>{issue.reason}</styled.IssueReason>
                    </styled.IssueHeaderText>
                  </styled.IssueHeaderSection>
                  <styled.IssueHeaderSection>
                    {issue.runbook && (
                      <Button
                        kind="tertiary"
                        size="compact"
                        shape="rounded"
                        $as="a"
                        target="_blank"
                        rel="noreferrer"
                        href={issue.runbook}
                        endEnhancer={<MdOpenInNew />}
                      >
                        Runbook
                      </Button>
                    )}
                  </styled.IssueHeaderSection>
                </styled.IssueHeader>
              }
              expanded={getIsIssueExpanded(issueExpansionId)}
              onChange={() => toggleIsIssueExpanded(issueExpansionId)}
            >
              <WorkflowDiagnosticsMetadataTable
                metadata={{
                  ...issue,
                }}
                {...workflowPageParams}
              />
            </Panel>
          </styled.IssueContainer>
        );
      })}
    </styled.Container>
  );
}
