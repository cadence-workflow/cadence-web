import { MdOpenInNew } from 'react-icons/md';

import Link from '@/components/link/link';

import { type IssueExpansionID } from '../workflow-diagnostics-content/workflow-diagnostics-content.types';
import WorkflowDiagnosticsIssue from '../workflow-diagnostics-issue/workflow-diagnostics-issue';

import { styled } from './workflow-diagnostics-list.styles';
import { type Props } from './workflow-diagnostics-list.types';

export default function WorkflowDiagnosticsList({
  diagnosticsIssuesGroups,
  getIsIssueExpanded,
  toggleIsIssueExpanded,
  ...workflowPageParams
}: Props) {
  return (
    <styled.IssuesGroupsContainer>
      {diagnosticsIssuesGroups.map(([issuesType, issuesGroup]) => {
        if (!issuesGroup || issuesGroup.issues.length === 0) return null;

        const { issues, rootCauses, runbook } = issuesGroup;
        return (
          <styled.IssuesGroup key={issuesType}>
            <styled.IssuesTitle>
              {issuesType}
              {runbook && (
                <Link href={runbook} target="_blank" rel="noreferrer">
                  <styled.RunbookLink>
                    View runbook
                    <MdOpenInNew />
                  </styled.RunbookLink>
                </Link>
              )}
            </styled.IssuesTitle>
            {issues.map((issue) => {
              const issueExpansionId: IssueExpansionID = `${issuesType}.${issue.issueId}`;

              return (
                <WorkflowDiagnosticsIssue
                  {...workflowPageParams}
                  key={issueExpansionId}
                  issue={issue}
                  rootCauses={
                    rootCauses
                      ? rootCauses.filter(
                          (rootCause) => rootCause.issueId === issue.issueId
                        )
                      : []
                  }
                  isExpanded={getIsIssueExpanded(issueExpansionId)}
                  onChangePanel={() => toggleIsIssueExpanded(issueExpansionId)}
                />
              );
            })}
          </styled.IssuesGroup>
        );
      })}
    </styled.IssuesGroupsContainer>
  );
}
