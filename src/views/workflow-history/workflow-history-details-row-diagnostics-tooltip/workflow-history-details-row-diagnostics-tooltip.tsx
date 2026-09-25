import { Button } from 'baseui/button';
import { RiStethoscopeLine } from 'react-icons/ri';

import { type DetailsRowValueComponentProps } from '../workflow-history-details-row/workflow-history-details-row.types';
import { type WorkflowDiagnosticsIssue } from '../workflow-history.types';

import {
  overrides,
  styled,
} from './workflow-history-details-row-diagnostics-tooltip.styles';

export default function WorkflowHistoryDetailsRowDiagnosticsTooltip({
  value,
  onClose,
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
      <Button
        kind="secondary"
        size="mini"
        onClick={onClose}
        overrides={overrides.seeMoreButton}
      >
        See more
      </Button>
    </styled.IssuesContainer>
  );
}
