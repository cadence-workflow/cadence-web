import { Virtuoso } from 'react-virtuoso';

import WorkflowHistoryTimelineLoadMore from '@/views/workflow-history/workflow-history-timeline-load-more/workflow-history-timeline-load-more';

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
        itemContent={(_, [__, group]) => (
          <div>{JSON.stringify(group)}</div>
          // <WorkflowHistoryTimelineGroup
          //   key={groupId}
          //   {...group}
          //   showLoadingMoreEvents={
          //     group.hasMissingEvents && !reachedEndOfAvailableHistory
          //   }
          //   resetToDecisionEventId={group.resetToDecisionEventId}
          //   isLastEvent={index === filteredEventGroupsEntries.length - 1}
          //   decodedPageUrlParams={decodedParams}
          //   getIsEventExpanded={getIsEventExpanded}
          //   onEventToggle={toggleIsEventExpanded}
          //   onReset={() => {
          //     if (group.resetToDecisionEventId) {
          //       setResetToDecisionEventId(group.resetToDecisionEventId);
          //     }
          //   }}
          //   selected={group.events.some(
          //     (e) => e.eventId === queryParams.historySelectedEventId
          //   )}
          //   workflowCloseStatus={workflowExecutionInfo?.closeStatus}
          //   workflowIsArchived={workflowExecutionInfo?.isArchived || false}
          //   workflowCloseTimeMs={workflowCloseTimeMs}
          // />
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
