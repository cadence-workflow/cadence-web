import {
  Panel,
  type SharedStylePropsArg as AccordionStyledComponentProps,
} from 'baseui/accordion';
import { Button } from 'baseui/button';
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdWarning,
  MdWarningAmber,
} from 'react-icons/md';

import WorkflowDiagnosticsMetadataTable from '../workflow-diagnostics-metadata-table/workflow-diagnostics-metadata-table';

import { overrides, styled } from './workflow-diagnostics-issue.styles';
import { type Props } from './workflow-diagnostics-issue.types';

export default function WorkflowDiagnosticsIssue({
  issue,
  rootCauses,
  isExpanded,
  onChangePanel,
  ...workflowPageParams
}: Props) {
  return (
    <Panel
      title={
        <styled.IssueHeader>
          <styled.IssueLabel>
            <styled.IssueIcon>
              {isExpanded ? (
                <MdWarning size={16} />
              ) : (
                <MdWarningAmber size={16} />
              )}
            </styled.IssueIcon>
            {issue.invariantType}
          </styled.IssueLabel>
          <styled.IssueActions></styled.IssueActions>
        </styled.IssueHeader>
      }
      overrides={{
        ...overrides.panel,
        ToggleIcon: {
          component: ({ $expanded }: AccordionStyledComponentProps) => (
            <Button
              size="mini"
              kind="secondary"
              endEnhancer={$expanded ? <MdArrowDropUp /> : <MdArrowDropDown />}
            >
              Details
            </Button>
          ),
        },
      }}
      expanded={isExpanded}
      onChange={onChangePanel}
    >
      <styled.DetailsRow>
        <styled.DetailsLabel>Reason</styled.DetailsLabel>
        <styled.DetailsValue>{issue.reason}</styled.DetailsValue>
      </styled.DetailsRow>
      {rootCauses.length > 0 && (
        <styled.DetailsRow>
          <styled.DetailsLabel>
            {rootCauses.length === 1 ? 'Root Cause' : 'Root Causes'}
          </styled.DetailsLabel>
          <styled.DetailsValue>
            <styled.RootCausesContainer>
              {rootCauses.map((rootCause, index) => (
                <styled.RootCauseContainer key={`rootCauses-${index}`}>
                  {rootCause.metadata ? (
                    <WorkflowDiagnosticsMetadataTable
                      metadata={{
                        Description: rootCause.rootCauseType,
                        ...rootCause.metadata,
                      }}
                      {...workflowPageParams}
                    />
                  ) : (
                    rootCause.rootCauseType
                  )}
                </styled.RootCauseContainer>
              ))}
            </styled.RootCausesContainer>
          </styled.DetailsValue>
        </styled.DetailsRow>
      )}
      {issue.metadata && (
        <styled.DetailsRow>
          <styled.DetailsLabel>Metadata</styled.DetailsLabel>
          <styled.DetailsValue>
            <WorkflowDiagnosticsMetadataTable
              metadata={issue.metadata}
              {...workflowPageParams}
            />
          </styled.DetailsValue>
        </styled.DetailsRow>
      )}
    </Panel>
  );
}
