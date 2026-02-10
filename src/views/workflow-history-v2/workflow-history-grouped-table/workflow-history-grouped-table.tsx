import { Virtuoso } from 'react-virtuoso';

import WorkflowHistoryEventGroup from '../workflow-history-event-group/workflow-history-event-group';
import WorkflowHistoryTableFooter from '../workflow-history-table-footer/workflow-history-table-footer';

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
  const noEventsToDisplay = eventGroupsById.length === 0;

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
                align: 'center',
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
            selectedEventId={selectedEventId}
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
            <WorkflowHistoryTableFooter
              error={error}
              noEventsToDisplay={noEventsToDisplay}
              canFetchMoreEvents={hasMoreEvents}
              fetchMoreEvents={fetchMoreEvents}
              isFetchingMoreEvents={isFetchingMoreEvents}
            />
          ),
        }}
      />
    </>
  );
}
