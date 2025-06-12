import { useMemo } from 'react';

import { Virtuoso } from 'react-virtuoso';

import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';
import { type RequestError } from '@/utils/request/request-error';
import { type WorkflowPageTabsParams } from '@/views/workflow-page/workflow-page-tabs/workflow-page-tabs.types';

import {
  type GetIsEventExpanded,
  type ToggleIsEventExpanded,
} from '../hooks/use-event-expansion-toggle.types';
import WorkflowHistoryTimelineLoadMore from '../workflow-history-timeline-load-more/workflow-history-timeline-load-more';
import WorkflowHistoryUngroupedCard from '../workflow-history-ungrouped-card/workflow-history-ungrouped-card';
import { type WorkflowHistoryUngroupedEventCardDetails } from '../workflow-history-ungrouped-card/workflow-history-ungrouped-card.types';
import { type HistoryEventsGroup } from '../workflow-history.types';

import { styled } from './workflow-history-ungrouped-list.styles';

export default function WorkflowHistoryUngroupedList({
  groupedEvents,
  decodedPageUrlParams,
  error,
  hasMoreEvents,
  isFetchingMoreEvents,
  fetchMoreEvents,
  getIsEventExpanded,
  toggleIsEventExpanded,
}: {
  groupedEvents: Array<[string, HistoryEventsGroup]>;
  decodedPageUrlParams: WorkflowPageTabsParams;
  error: RequestError | null;
  hasMoreEvents: boolean;
  isFetchingMoreEvents: boolean;
  fetchMoreEvents: () => void;
  getIsEventExpanded: GetIsEventExpanded;
  toggleIsEventExpanded: ToggleIsEventExpanded;
}) {
  const sortedUngroupedEventCardDetails: Array<WorkflowHistoryUngroupedEventCardDetails> =
    useMemo(
      () =>
        groupedEvents
          .map(([_, group]) => [
            ...group.events.map((event, index) => ({
              event,
              label: group.label,
              status: group.eventsMetadata[index].status,
              statusLabel: group.eventsMetadata[index].label,
              id: event.eventId ?? '',
            })),
          ])
          .flat(1)
          .sort((eventA, eventB) => {
            if (eventA.id && eventB.id) {
              return parseInt(eventA.id) - parseInt(eventB.id);
            }

            if (eventA.id) return 1;
            if (eventB.id) return -1;

            if (!eventA.event.eventTime || !eventB.event.eventTime) return 0;

            return (
              parseGrpcTimestamp(eventA.event.eventTime) -
              parseGrpcTimestamp(eventB.event.eventTime)
            );
          }),
      [groupedEvents]
    );

  const workflowStartTime = sortedUngroupedEventCardDetails[0].event.eventTime;

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
        useWindowScroll
        data={sortedUngroupedEventCardDetails}
        itemContent={(_, cardDetails) => (
          <WorkflowHistoryUngroupedCard
            cardDetails={cardDetails}
            workflowStartTime={workflowStartTime}
            decodedPageUrlParams={decodedPageUrlParams}
            isExpanded={getIsEventExpanded(cardDetails.id)}
            toggleIsExpanded={() => toggleIsEventExpanded(cardDetails.id)}
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
