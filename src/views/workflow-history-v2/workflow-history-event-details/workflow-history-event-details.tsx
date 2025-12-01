import { useMemo } from 'react';

import WorkflowHistoryEventDetailsGroup from '@/views/workflow-history/workflow-history-event-details-group/workflow-history-event-details-group';
import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import WorkflowHistoryGroupDetailsJson from '../workflow-history-group-details-json/workflow-history-group-details-json';

import { styled } from './workflow-history-event-details.styles';
import {
  type EventDetailsEntries,
  type EventDetailsSingleEntry,
} from './workflow-history-event-details.types';

export default function WorkflowHistoryEventDetails({
  eventDetails,
  workflowPageParams,
}: {
  eventDetails: EventDetailsEntries;
  workflowPageParams: WorkflowPageParams;
}) {
  const [panelDetails, restDetails] = useMemo(
    () =>
      eventDetails.reduce<
        [Array<EventDetailsSingleEntry>, EventDetailsEntries]
      >(
        ([panels, rest], entry) => {
          if (entry.renderConfig?.showInPanels && !entry.isGroup) {
            panels.push(entry);
          } else {
            rest.push(entry);
          }

          return [panels, rest];
        },
        [[], []]
      ),
    [eventDetails]
  );

  if (eventDetails.length === 0) {
    return <styled.EmptyDetails>No Details</styled.EmptyDetails>;
  }

  return (
    <styled.EventDetailsContainer>
      {panelDetails.length > 0 && (
        <styled.PanelDetails>
          {panelDetails.map((detail) => (
            <WorkflowHistoryGroupDetailsJson
              key={detail.path}
              entryPath={detail.path}
              entryValue={detail.value}
              isNegative={detail.isNegative}
              {...workflowPageParams}
            />
          ))}
        </styled.PanelDetails>
      )}
      <styled.RestDetails>
        <WorkflowHistoryEventDetailsGroup
          entries={restDetails}
          decodedPageUrlParams={{
            ...workflowPageParams,
            workflowTab: 'history',
          }}
        />
      </styled.RestDetails>
    </styled.EventDetailsContainer>
  );
}
