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
  decodedPageUrlParams,
  reachedEndOfAvailableHistory,
  workflowCloseStatus,
  workflowIsArchived,
  workflowCloseTimeMs,
  selectedEventId,
  getIsEventExpanded,
  toggleIsEventExpanded,
  resetToDecisionEventId,
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
        itemContent={(_, [__, group]) => (
          <WorkflowHistoryEventGroup
            eventGroup={group}
            getIsEventExpanded={getIsEventExpanded}
            toggleIsEventExpanded={toggleIsEventExpanded}
            showLoadingMoreEvents={
              group.hasMissingEvents && !reachedEndOfAvailableHistory
            }
            decodedPageUrlParams={decodedPageUrlParams}
            selected={group.events.some((e) => e.eventId === selectedEventId)}
            workflowCloseStatus={workflowCloseStatus}
            workflowIsArchived={workflowIsArchived}
            workflowCloseTimeMs={workflowCloseTimeMs}
            onReset={() => {
              if (group.resetToDecisionEventId) {
                resetToDecisionEventId(group.resetToDecisionEventId);
              }
            }}
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
