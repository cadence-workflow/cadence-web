import { useMemo, useState } from 'react';

import { Button } from 'baseui/button';
import { ButtonGroup } from 'baseui/button-group';
import { MdClose, MdList, MdSchedule } from 'react-icons/md';

import WorkflowHistoryEventDetails from '../workflow-history-event-details/workflow-history-event-details';
import WorkflowHistoryEventLinkButton from '../workflow-history-event-link-button/workflow-history-event-link-button';

import { overrides, styled } from './workflow-history-group-details.styles';
import { type Props } from './workflow-history-group-details.types';

export default function WorkflowHistoryGroupDetails({
  groupDetailsEntries,
  initialEventId,
  isUngroupedView,
  isScrollable,
  workflowPageParams,
  onClose,
  onClickShowInTimeline,
  onClickShowInTable,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number>(
    (() => {
      const selectedIdx = groupDetailsEntries.findIndex(
        ([eventId]) => eventId === initialEventId
      );
      return selectedIdx >= 0 ? selectedIdx : 0;
    })()
  );

  const [selectedEventId, selectedEventTabContent] = useMemo(
    () => groupDetailsEntries[selectedIndex],
    [groupDetailsEntries, selectedIndex]
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
          {onClickShowInTimeline && (
            <Button
              kind="tertiary"
              size="compact"
              aria-label="Show in timeline"
              onClick={onClickShowInTimeline}
              startEnhancer={<MdSchedule size={16} />}
            >
              Show in timeline
            </Button>
          )}
          {onClickShowInTable && (
            <Button
              kind="tertiary"
              size="compact"
              aria-label="Show in table"
              onClick={onClickShowInTable}
              startEnhancer={<MdList size={16} />}
            >
              Show in table
            </Button>
          )}
          <WorkflowHistoryEventLinkButton
            historyEventId={selectedEventId}
            isUngroupedView={isUngroupedView}
          />
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
        eventDetails={selectedEventTabContent.eventDetails ?? []}
        isScrollable={isScrollable}
        workflowPageParams={workflowPageParams}
      />
    </styled.GroupDetailsContainer>
  );
}
