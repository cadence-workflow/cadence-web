import WorkflowDiagnosticsIssue from '../workflow-diagnostics-issue/workflow-diagnostics-issue';

import { styled } from './workflow-diagnostics-list.styles';
import { type Props } from './workflow-diagnostics-list.types';

export default function WorkflowDiagnosticsList({ diagnosticsResult }: Props) {
  // TODO @adhitya.mamallan - use expansion hook here to evaluate state of expanded issues

  return (
    <styled.IssuesGroupsContainer>
      {Object.entries(diagnosticsResult.DiagnosticsResult).map(
        ([issuesType, issuesGroup]) => {
          if (!issuesGroup || issuesGroup.Issues.length === 0) return null;

          const { Issues, RootCause } = issuesGroup;
          return (
            <styled.IssuesGroup key={issuesType}>
              <styled.IssuesTitle>{issuesType}</styled.IssuesTitle>
              {Issues.map((issue) => (
                <WorkflowDiagnosticsIssue
                  key={`${issuesType}.${issue.IssueID}`}
                  issue={issue}
                  rootCauses={
                    RootCause
                      ? RootCause.filter(
                          (rootCause) => rootCause.IssueID === issue.IssueID
                        )
                      : []
                  }
                />
              ))}
            </styled.IssuesGroup>
          );
        }
      )}
    </styled.IssuesGroupsContainer>
  );
}
