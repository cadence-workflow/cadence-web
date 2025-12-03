import { useMemo } from 'react';

import WorkflowHistoryEventDetailsEntry from '@/views/workflow-history/workflow-history-event-details-entry/workflow-history-event-details-entry';
import WorkflowHistoryEventDetailsGroup from '@/views/workflow-history/workflow-history-event-details-group/workflow-history-event-details-group';
import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import { styled } from './workflow-history-event-details.styles';
import { type EventDetailsEntries } from './workflow-history-event-details.types';

export default function WorkflowHistoryEventDetails({
  eventDetails,
  workflowPageParams,
}: {
  eventDetails: EventDetailsEntries;
  workflowPageParams: WorkflowPageParams;
}) {
  const [panelDetails, restDetails] = useMemo(
    () =>
      eventDetails.reduce<[EventDetailsEntries, EventDetailsEntries]>(
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
          {panelDetails.map((detail) => {
            return (
              <styled.PanelContainer key={detail.path}>
                {!detail.isGroup ? (
                  <WorkflowHistoryEventDetailsEntry
                    entryKey={detail.key}
                    entryPath={detail.path}
                    entryValue={detail.value}
                    isNegative={detail.isNegative}
                    renderConfig={detail.renderConfig}
                    {...workflowPageParams}
                  />
                ) : (
                  <WorkflowHistoryEventDetailsGroup
                    entries={restDetails}
                    decodedPageUrlParams={{
                      ...workflowPageParams,
                      workflowTab: 'history',
                    }}
                  />
                )}
              </styled.PanelContainer>
            );
          })}
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
