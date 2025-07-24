import WorkflowDiagnosticsIssue from '../workflow-diagnostics-issue/workflow-diagnostics-issue';

import { styled } from './workflow-diagnostics-list.styles';
import { type Props } from './workflow-diagnostics-list.types';

export default function WorkflowDiagnosticsList({ diagnosticsResult }: Props) {
  // TODO @adhitya.mamallan - use expansion hook here to evaluate state of expanded issues

  return (
    <styled.IssuesGroupsContainer>
      {Object.entries(diagnosticsResult.result).map(
        ([issuesType, issuesGroup]) => {
          if (!issuesGroup || issuesGroup.issues.length === 0) return null;

          const { issues, rootCauses } = issuesGroup;
          return (
            <styled.IssuesGroup key={issuesType}>
              <styled.IssuesTitle>{issuesType}</styled.IssuesTitle>
              {issues.map((issue) => (
                <WorkflowDiagnosticsIssue
                  key={`${issuesType}.${issue.issueId}`}
                  issue={issue}
                  rootCauses={
                    rootCauses
                      ? rootCauses.filter(
                          (rootCause) => rootCause.issueId === issue.issueId
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
