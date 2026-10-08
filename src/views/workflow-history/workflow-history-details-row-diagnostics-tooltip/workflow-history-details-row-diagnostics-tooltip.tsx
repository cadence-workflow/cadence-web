import { Button } from 'baseui/button';
import { RiStethoscopeLine } from 'react-icons/ri';

import { type WorkflowDiagnosticsIssue } from '../workflow-history.types';

import { styled } from './workflow-history-details-row-diagnostics-tooltip.styles';
import { type Props } from './workflow-history-details-row-diagnostics-tooltip.types';

export default function WorkflowHistoryDetailsRowDiagnosticsTooltip({
  value,
  onClickOpenEvent,
  isEventOpen,
  closeTooltip,
}: Props) {
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
      {onClickOpenEvent && (
        <styled.ButtonContainer>
          <Button
            kind="secondary"
            size="mini"
            shape="pill"
            disabled={isEventOpen}
            onClick={(e) => {
              // The tooltip portal still bubbles React events to the accordion header
              e.stopPropagation();
              onClickOpenEvent();
              closeTooltip?.();
            }}
          >
            Open event
          </Button>
        </styled.ButtonContainer>
      )}
    </styled.IssuesContainer>
  );
}
