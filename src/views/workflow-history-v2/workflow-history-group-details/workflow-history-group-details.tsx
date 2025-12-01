import { useMemo, useState } from 'react';

import { Button } from 'baseui/button';
import { ButtonGroup } from 'baseui/button-group';
import { MdClose } from 'react-icons/md';

import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import WorkflowHistoryEventDetails from '../workflow-history-event-details/workflow-history-event-details';

import { overrides, styled } from './workflow-history-group-details.styles';
import { type GroupDetails } from './workflow-history-group-details.types';

export default function WorkflowHistoryGroupDetails({
  groupDetails,
  initialEventId,
  workflowPageParams,
  onClose,
}: {
  groupDetails: GroupDetails;
  initialEventId: string | undefined;
  workflowPageParams: WorkflowPageParams;
  onClose?: () => void;
}) {
  const groupEventIds = useMemo(
    () => Object.keys(groupDetails),
    [groupDetails]
  );

  const [selectedIndex, setSelectedIndex] = useState<number>(
    (() => {
      const selectedIdx = groupEventIds.findIndex(
        (eventId) => eventId === initialEventId
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
          {groupEventIds.map((eventId) => (
            <Button key={eventId}>{groupDetails[eventId].eventLabel}</Button>
          ))}
        </ButtonGroup>
        <styled.ExtraActions>
          {/* Copy Link Button */}
          {onClose && (
            <Button
              kind="tertiary"
              size="compact"
              data-testid="close-details-button"
              onClick={onClose}
            >
              <MdClose />
            </Button>
          )}
        </styled.ExtraActions>
      </styled.ActionsRow>
      <WorkflowHistoryEventDetails
        eventDetails={
          groupDetails[groupEventIds[selectedIndex]]?.eventDetails ?? []
        }
        workflowPageParams={workflowPageParams}
      />
    </styled.GroupDetailsContainer>
  );
}
