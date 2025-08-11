import { useMemo } from 'react';

import { Virtuoso } from 'react-virtuoso';

import WorkflowHistoryTimelineLoadMore from '../workflow-history-timeline-load-more/workflow-history-timeline-load-more';
import WorkflowHistoryUngroupedEvent from '../workflow-history-ungrouped-event/workflow-history-ungrouped-event';

import { styled } from './workflow-history-ungrouped-table.styles';
import { type Props } from './workflow-history-ungrouped-table.types';

export default function WorkflowHistoryUngroupedTable({
  eventsInfo,
  selectedEventId,
  decodedPageUrlParams,
  onResetToEventId,
  error,
  hasMoreEvents,
  isFetchingMoreEvents,
  fetchMoreEvents,
  getIsEventExpanded,
  toggleIsEventExpanded,
  onVisibleRangeChange,
  virtuosoRef,
}: Props) {
  const workflowStartTime =
    eventsInfo.length > 0 ? eventsInfo[0].event.eventTime : null;

  const maybeHighlightedEventId = useMemo(
    () => eventsInfo.findIndex((v) => v.id === selectedEventId),
    [eventsInfo, selectedEventId]
  );

  return (
    <>
      <styled.TableHeader>
        <div>ID</div>
        <div>Type</div>
        <div>Event</div>
        <div>Time</div>
        <div>Elapsed</div>
      </styled.TableHeader>
      <Virtuoso
        ref={virtuosoRef}
        useWindowScroll
        data={eventsInfo}
        itemContent={(_, eventInfo) => (
          <WorkflowHistoryUngroupedEvent
            eventInfo={eventInfo}
            workflowStartTime={workflowStartTime}
            decodedPageUrlParams={decodedPageUrlParams}
            isExpanded={getIsEventExpanded(eventInfo.id)}
            toggleIsExpanded={() => toggleIsEventExpanded(eventInfo.id)}
            animateOnEnter={eventInfo.id === selectedEventId}
            {...(eventInfo.canReset
              ? { onReset: () => onResetToEventId(eventInfo.id) }
              : {})}
          />
        )}
        {...(maybeHighlightedEventId !== -1 && {
          initialTopMostItemIndex: maybeHighlightedEventId,
        })}
        rangeChanged={onVisibleRangeChange}
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
