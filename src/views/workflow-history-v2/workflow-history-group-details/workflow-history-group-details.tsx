import { useState } from 'react';

import { Button } from 'baseui/button';
import { ButtonGroup } from 'baseui/button-group';
import { MdClose } from 'react-icons/md';

import WorkflowHistoryEventDetails from '../workflow-history-event-details/workflow-history-event-details';

import { overrides, styled } from './workflow-history-group-details.styles';
import { type Props } from './workflow-history-group-details.types';

export default function WorkflowHistoryGroupDetails({
  groupDetailsEntries,
  initialEventId,
  workflowPageParams,
  onClose,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number>(
    (() => {
      const selectedIdx = groupDetailsEntries.findIndex(
        ([eventId]) => eventId === initialEventId
      );
      return selectedIdx >= 0 ? selectedIdx : 0;
    })()
  );

  return (
    <styled.GroupDetailsContainer>
      <styled.ActionsRow>
        <ButtonGroup
          mode="radio"
          size="compact"
          kind="tertiary"
          selected={selectedIndex}
          onClick={(_, index) => {
            setSelectedIndex(index);
          }}
          overrides={overrides.buttonGroup}
        >
          {groupDetailsEntries.map(([eventId, eventDetailsTabContent]) => (
            <Button key={eventId}>{eventDetailsTabContent.eventLabel}</Button>
          ))}
        </ButtonGroup>
        <styled.ExtraActions>
          {/* Copy Link Button */}
          {onClose && (
            <Button
              kind="tertiary"
              size="compact"
              aria-label="Close event details"
              onClick={onClose}
            >
              <MdClose />
            </Button>
          )}
        </styled.ExtraActions>
      </styled.ActionsRow>
      <WorkflowHistoryEventDetails
        eventDetails={
          groupDetailsEntries[selectedIndex]?.[1].eventDetails ?? []
        }
        workflowPageParams={workflowPageParams}
      />
    </styled.GroupDetailsContainer>
  );
}
