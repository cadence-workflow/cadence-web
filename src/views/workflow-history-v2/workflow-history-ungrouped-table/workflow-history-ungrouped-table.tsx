import { useMemo } from 'react';

import { Virtuoso } from 'react-virtuoso';

import WorkflowHistoryTableFooter from '../workflow-history-table-footer/workflow-history-table-footer';
import WorkflowHistoryUngroupedEvent from '../workflow-history-ungrouped-event/workflow-history-ungrouped-event';

import compareUngroupedEvents from './helpers/compare-ungrouped-events';
import { styled } from './workflow-history-ungrouped-table.styles';
import {
  type UngroupedEventInfo,
  type Props,
} from './workflow-history-ungrouped-table.types';

export default function WorkflowHistoryUngroupedTable({
  eventGroupsById,
  virtuosoRef,
  setVisibleRange,
  decodedPageUrlParams,
  selectedEventId,
  getIsEventExpanded,
  toggleIsEventExpanded,
  resetToDecisionEventId,
  error,
  hasMoreEvents,
  fetchMoreEvents,
  isFetchingMoreEvents,
}: Props) {
  const eventsInfoFromGroups = useMemo<Array<UngroupedEventInfo>>(
    () =>
      eventGroupsById
        .map(([_, group]) => [
          ...group.events.map((event, index) => ({
            id: event.eventId ?? event.computedEventId,
            event,
            eventMetadata: group.eventsMetadata[index],
            eventGroup: group,
            label: group.label,
            shortLabel: group.shortLabel,
            canReset: group.resetToDecisionEventId === event.eventId,
          })),
        ])
        .flat(1)
        .sort(compareUngroupedEvents),
    [eventGroupsById]
  );

  const workflowStartTimeMs = useMemo(
    () =>
      eventGroupsById.length > 0 ? eventGroupsById[0][1].startTimeMs : null,
    [eventGroupsById]
  );

  const maybeHighlightedEventId = useMemo(
    () => eventsInfoFromGroups.findIndex((v) => v.id === selectedEventId),
    [eventsInfoFromGroups, selectedEventId]
  );

  return (
    <>
      <styled.TableHeader>
        <div />
        <div>ID</div>
        <div>Event group</div>
        <div>Status</div>
        <div>Time</div>
        <div>Duration</div>
        <div>Details</div>
      </styled.TableHeader>
      <Virtuoso
        useWindowScroll
        data={eventsInfoFromGroups}
        ref={virtuosoRef}
        defaultItemHeight={36}
        rangeChanged={setVisibleRange}
        itemContent={(_, eventInfo) => (
          <WorkflowHistoryUngroupedEvent
            eventInfo={eventInfo}
            workflowStartTimeMs={workflowStartTimeMs}
            decodedPageUrlParams={decodedPageUrlParams}
            isExpanded={getIsEventExpanded(eventInfo.id)}
            toggleIsExpanded={() => toggleIsEventExpanded(eventInfo.id)}
            animateOnEnter={eventInfo.id === selectedEventId}
            {...(eventInfo.canReset
              ? { onReset: () => resetToDecisionEventId(eventInfo.id) }
              : {})}
          />
        )}
        {...(maybeHighlightedEventId !== -1 && {
          initialTopMostItemIndex: {
            index: maybeHighlightedEventId,
            align: 'center',
            behavior: 'auto',
          },
        })}
        components={{
          Footer: () => (
            <WorkflowHistoryTableFooter
              error={error}
              hasMoreEvents={hasMoreEvents}
              fetchMoreEvents={fetchMoreEvents}
              isFetchingMoreEvents={isFetchingMoreEvents}
            />
          ),
        }}
      />
    </>
  );
}
