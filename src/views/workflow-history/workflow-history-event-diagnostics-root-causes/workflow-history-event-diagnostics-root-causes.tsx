import isEmpty from 'lodash/isEmpty';
import { MdCircle } from 'react-icons/md';

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
            <styled.RootCauseBullet>
              <MdCircle size={8} />
            </styled.RootCauseBullet>
            <styled.RootCauseType>
              {rootCause.rootCauseType}
            </styled.RootCauseType>
          </styled.RootCauseHeader>
          {!isEmpty(rootCause.metadata) && (
            <styled.RootCauseMetadata>
              <WorkflowHistoryEventDiagnosticsTable
                metadata={rootCause.metadata}
              />
            </styled.RootCauseMetadata>
          )}
        </styled.RootCauseItem>
      ))}
    </styled.RootCausesList>
  );
}
