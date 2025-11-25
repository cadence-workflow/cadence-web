import { Virtuoso } from 'react-virtuoso';

import WorkflowHistoryTimelineLoadMore from '@/views/workflow-history/workflow-history-timeline-load-more/workflow-history-timeline-load-more';

import WorkflowHistoryEventGroup from '../workflow-history-event-group/workflow-history-event-group';

import { styled } from './workflow-history-grouped-table.styles';
import { type Props } from './workflow-history-grouped-table.types';

export default function WorkflowHistoryGroupedTable({
  eventGroupsById,
  virtuosoRef,
  initialStartIndex,
  setVisibleRange,
  error,
  hasMoreEvents,
  fetchMoreEvents,
  isFetchingMoreEvents,
  decodedPageUrlParams,
  reachedEndOfAvailableHistory,
  workflowCloseStatus,
  workflowIsArchived,
  workflowCloseTimeMs,
  selectedEventId,
}: Props) {
  return (
    <>
      <styled.TableHeader>
        <div />
        <div>Event group</div>
        <div>Status</div>
        <div>Time</div>
        <div>Duration</div>
        <div>Details</div>
      </styled.TableHeader>
      <Virtuoso
        useWindowScroll
        data={eventGroupsById}
        ref={virtuosoRef}
        defaultItemHeight={160}
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
        itemContent={(index, [groupId, group]) => (
          <WorkflowHistoryEventGroup
            key={groupId}
            {...group}
            showLoadingMoreEvents={
              group.hasMissingEvents && !reachedEndOfAvailableHistory
            }
            resetToDecisionEventId={group.resetToDecisionEventId}
            isLastEvent={index === eventGroupsById.length - 1}
            decodedPageUrlParams={decodedPageUrlParams}
            selected={group.events.some((e) => e.eventId === selectedEventId)}
            workflowCloseStatus={workflowCloseStatus}
            workflowIsArchived={workflowIsArchived}
            workflowCloseTimeMs={workflowCloseTimeMs}
          />
        )}
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
