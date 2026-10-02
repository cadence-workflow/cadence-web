import { RiStethoscopeLine } from 'react-icons/ri';

import { type DetailsRowValueComponentProps } from '../workflow-history-details-row/workflow-history-details-row.types';
import { type WorkflowDiagnosticsIssue } from '../workflow-history.types';

import { styled } from './workflow-history-details-row-diagnostics-tooltip.styles';

export default function WorkflowHistoryDetailsRowDiagnosticsTooltip({
  value,
}: DetailsRowValueComponentProps) {
  const issues: Array<WorkflowDiagnosticsIssue> = value;

  return (
    <styled.IssuesContainer>
      {issues.map((issue) => (
        <styled.Issue key={`${issue.invariantType}.${issue.issueId}`}>
          <styled.IssueIcon>
            <RiStethoscopeLine size={16} />
          </styled.IssueIcon>
          <styled.IssueText>
            <styled.IssueHeading>{issue.invariantType}</styled.IssueHeading>
            <styled.IssueCaption>{issue.reason}</styled.IssueCaption>
          </styled.IssueText>
        </styled.Issue>
      ))}
    </styled.IssuesContainer>
  );
}
