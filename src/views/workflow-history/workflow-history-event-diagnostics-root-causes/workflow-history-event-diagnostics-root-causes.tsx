import isEmpty from 'lodash/isEmpty';

import WorkflowHistoryEventDiagnosticsPlaceholderText from '../workflow-history-event-diagnostics-placeholder-text/workflow-history-event-diagnostics-placeholder-text';
import WorkflowHistoryEventDiagnosticsTable from '../workflow-history-event-diagnostics-table/workflow-history-event-diagnostics-table';

import { styled } from './workflow-history-event-diagnostics-root-causes.styles';
import { type Props } from './workflow-history-event-diagnostics-root-causes.types';

export default function WorkflowHistoryEventDiagnosticsRootCauses({
  value,
}: Props) {
  return (
    <styled.RootCausesList>
      {value.map((rootCause, index) => (
        <styled.RootCauseItem key={`${rootCause.rootCauseType}.${index}`}>
          <styled.RootCauseHeader>
            <styled.RootCauseType>
              {rootCause.rootCauseType}
            </styled.RootCauseType>
          </styled.RootCauseHeader>
          <styled.RootCauseMetadata>
            {isEmpty(rootCause.metadata) ? (
              <WorkflowHistoryEventDiagnosticsPlaceholderText placeholderText="No metadata" />
            ) : (
              <WorkflowHistoryEventDiagnosticsTable
                metadata={rootCause.metadata}
                isCompact
              />
            )}
          </styled.RootCauseMetadata>
        </styled.RootCauseItem>
      ))}
    </styled.RootCausesList>
  );
}
