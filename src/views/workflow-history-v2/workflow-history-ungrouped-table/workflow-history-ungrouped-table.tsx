import { useMemo } from 'react';

import { Virtuoso } from 'react-virtuoso';

import WorkflowHistoryTableFooter from '../workflow-history-table-footer/workflow-history-table-footer';
import WorkflowHistoryUngroupedEvent from '../workflow-history-ungrouped-event/workflow-history-ungrouped-event';

import { styled } from './workflow-history-ungrouped-table.styles';
import { type Props } from './workflow-history-ungrouped-table.types';

export default function WorkflowHistoryUngroupedTable({
  ungroupedEventsInfo,
  workflowStartTimeMs,
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
  const maybeHighlightedEventIndex = useMemo(
    () => ungroupedEventsInfo.findIndex((v) => v.id === selectedEventId),
    [ungroupedEventsInfo, selectedEventId]
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
        data={ungroupedEventsInfo}
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
        {...(maybeHighlightedEventIndex !== -1 && {
          initialTopMostItemIndex: {
            index: maybeHighlightedEventIndex,
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
