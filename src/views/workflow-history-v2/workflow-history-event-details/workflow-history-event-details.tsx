import { useMemo } from 'react';

import partition from 'lodash/partition';

import WorkflowHistoryEventDetailsGroup from '@/views/workflow-history/workflow-history-event-details-group/workflow-history-event-details-group';

import WorkflowHistoryPanelDetailsEntry from '../workflow-history-panel-details-entry/workflow-history-panel-details-entry';

import { styled } from './workflow-history-event-details.styles';
import { type Props } from './workflow-history-event-details.types';

export default function WorkflowHistoryEventDetails({
  eventDetails,
  workflowPageParams,
}: Props) {
  const [panelDetails, restDetails] = useMemo(
    () =>
      partition(eventDetails, (detail) => detail.renderConfig?.showInPanels),
    [eventDetails]
  );

  if (eventDetails.length === 0) {
    return <styled.EmptyDetails>No Details</styled.EmptyDetails>;
  }

  return (
    <styled.EventDetailsContainer>
      {panelDetails.length > 0 && (
        <styled.PanelDetails>
          {panelDetails.map((detail) => {
            return (
              <styled.PanelContainer key={detail.path}>
                <WorkflowHistoryPanelDetailsEntry
                  detail={detail}
                  {...workflowPageParams}
                />
              </styled.PanelContainer>
            );
          })}
        </styled.PanelDetails>
      )}
      <styled.RestDetails>
        <WorkflowHistoryEventDetailsGroup
          entries={restDetails}
          decodedPageUrlParams={workflowPageParams}
        />
      </styled.RestDetails>
    </styled.EventDetailsContainer>
  );
}
