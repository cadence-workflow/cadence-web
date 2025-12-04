import { useMemo } from 'react';

import { Virtuoso } from 'react-virtuoso';

import compareUngroupedEvents from '@/views/workflow-history/helpers/compare-ungrouped-events';
import WorkflowHistoryTimelineLoadMore from '@/views/workflow-history/workflow-history-timeline-load-more/workflow-history-timeline-load-more';

import WorkflowHistoryUngroupedEvent from '../workflow-history-ungrouped-event/workflow-history-ungrouped-event';

import { styled } from './workflow-history-ungrouped-table.styles';
import {
  type UngroupedEventInfo,
  type Props,
} from './workflow-history-ungrouped-table.types';

export default function WorkflowHistoryUngroupedTable({
  eventGroupsById,
  virtuosoRef,
  initialStartIndex,
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
            event,
            eventMetadata: group.eventsMetadata[index],
            label: group.label,
            shortLabel: group.shortLabel,
            id: event.eventId ?? event.computedEventId,
            canReset: group.resetToDecisionEventId === event.eventId,
          })),
        ])
        .flat(1)
        .sort(compareUngroupedEvents),
    [eventGroupsById]
  );

  const workflowStartTime = useMemo(
    () =>
      eventsInfoFromGroups.length > 0
        ? eventsInfoFromGroups[0].event.eventTime
        : null,
    [eventsInfoFromGroups]
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
        {...(initialStartIndex === undefined
          ? {}
          : {
              initialTopMostItemIndex: {
                index: initialStartIndex,
                align: 'start',
                behavior: 'auto',
              },
            })}
        itemContent={(_, eventInfo) => (
          <WorkflowHistoryUngroupedEvent
            eventInfo={eventInfo}
            workflowStartTime={workflowStartTime}
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
          initialTopMostItemIndex: maybeHighlightedEventId,
        })}
        components={{
          Footer: () => (
            <WorkflowHistoryTimelineLoadMore
              error={error}
              fetchNextPage={fetchMoreEvents}
              hasNextPage={hasMoreEvents}
              isFetchingNextPage={isFetchingMoreEvents}
            />
          ),
        }}
      />
    </>
  );
}
