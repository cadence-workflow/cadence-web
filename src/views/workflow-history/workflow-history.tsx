'use client';
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  useSuspenseInfiniteQuery,
  type InfiniteData,
} from '@tanstack/react-query';
import queryString from 'query-string';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';

import usePageFilters from '@/components/page-filters/hooks/use-page-filters';
import PageSection from '@/components/page-section/page-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import useThrottledState from '@/hooks/use-throttled-state';
import { type GetWorkflowHistoryResponse } from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';
import decodeUrlParams from '@/utils/decode-url-params';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';
import sortBy from '@/utils/sort-by';

import { resetWorkflowActionConfig } from '../workflow-actions/config/workflow-actions.config';
import WorkflowActionsModal from '../workflow-actions/workflow-actions-modal/workflow-actions-modal';
import workflowPageQueryParamsConfig from '../workflow-page/config/workflow-page-query-params.config';
import { useSuspenseDescribeWorkflow } from '../workflow-page/hooks/use-describe-workflow';

import workflowHistoryFiltersConfig from './config/workflow-history-filters.config';
import WORKFLOW_HISTORY_PAGE_SIZE_CONFIG from './config/workflow-history-page-size.config';
import compareUngroupedEvents from './helpers/compare-ungrouped-events';
import getSortableEventId from './helpers/get-sortable-event-id';
import getVisibleGroupsHasMissingEvents from './helpers/get-visible-groups-has-missing-events';
import { groupHistoryEvents } from './helpers/group-history-events';
import pendingActivitiesInfoToEvents from './helpers/pending-activities-info-to-events';
import pendingDecisionInfoToEvent from './helpers/pending-decision-info-to-event';
import useEventExpansionToggle from './hooks/use-event-expansion-toggle';
import useInitialSelectedEvent from './hooks/use-initial-selected-event';
import useKeepLoadingEvents from './hooks/use-keep-loading-events';
import WorkflowHistoryCompactEventCard from './workflow-history-compact-event-card/workflow-history-compact-event-card';
import { WorkflowHistoryContext } from './workflow-history-context-provider/workflow-history-context-provider';
import WorkflowHistoryHeader from './workflow-history-header/workflow-history-header';
import WorkflowHistoryTimelineGroup from './workflow-history-timeline-group/workflow-history-timeline-group';
import WorkflowHistoryTimelineLoadMore from './workflow-history-timeline-load-more/workflow-history-timeline-load-more';
import { type WorkflowHistoryUngroupedEventInfo } from './workflow-history-ungrouped-event/workflow-history-ungrouped-event.types';
import WorkflowHistoryUngroupedTable from './workflow-history-ungrouped-table/workflow-history-ungrouped-table';
import { cssStyles } from './workflow-history.styles';
import {
  type VisibleHistoryGroupRanges,
  type Props,
} from './workflow-history.types';

export default function WorkflowHistory({ params }: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const decodedParams = decodeUrlParams<Props['params']>(params);

  const { workflowTab, ...historyQueryParams } = params;
  const wfHistoryRequestArgs = {
    ...historyQueryParams,
    pageSize: WORKFLOW_HISTORY_PAGE_SIZE_CONFIG,
    waitForNewEvent: 'true',
  };
  const [resetToDecisionEventId, setResetToDecisionEventId] = useState<
    string | undefined
  >(undefined);

  const {
    activeFiltersCount,
    queryParams,
    setQueryParams,
    ...pageFiltersRest
  } = usePageFilters({
    pageQueryParamsConfig: workflowPageQueryParamsConfig,
    pageFiltersConfig: workflowHistoryFiltersConfig,
  });

  const { ungroupedViewUserPreference, setUngroupedViewUserPreference } =
    useContext(WorkflowHistoryContext);

  const isUngroupedHistoryViewEnabled = useMemo(() => {
    if (queryParams.ungroupedHistoryViewEnabled !== undefined)
      return queryParams.ungroupedHistoryViewEnabled;

    return ungroupedViewUserPreference ?? false;
  }, [queryParams.ungroupedHistoryViewEnabled, ungroupedViewUserPreference]);

  const { data: wfExecutionDescription } = useSuspenseDescribeWorkflow({
    ...params,
  });
  const { workflowExecutionInfo } = wfExecutionDescription;
  const {
    data: result,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
    isFetchNextPageError,
  } = useSuspenseInfiniteQuery<
    GetWorkflowHistoryResponse,
    RequestError,
    InfiniteData<GetWorkflowHistoryResponse>,
    [string, typeof wfHistoryRequestArgs],
    string | undefined
  >({
    queryKey: ['workflow_history_paginated', wfHistoryRequestArgs] as const,
    queryFn: ({ queryKey: [_, qp], pageParam }) =>
      request(
        `/api/domains/${qp.domain}/${qp.cluster}/workflows/${qp.workflowId}/${qp.runId}/history?${queryString.stringify(
          {
            nextPage: pageParam,
            pageSize: qp.pageSize,
            waitForNewEvent: qp.waitForNewEvent,
          }
        )}`
      ).then((res) => res.json()),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.nextPageToken) return undefined;
      return lastPage?.nextPageToken;
    },
  });

  const events = useMemo(
    () =>
      (result.pages || [])
        .flat(1)
        .map(({ history }) => history?.events || [])
        .flat(1),
    [result]
  );

  const pendingHistoryEvents = useMemo(() => {
    const pendingStartActivities = pendingActivitiesInfoToEvents(
      wfExecutionDescription.pendingActivities
    );
    const pendingStartDecision = wfExecutionDescription.pendingDecision
      ? pendingDecisionInfoToEvent(wfExecutionDescription.pendingDecision)
      : null;

    return {
      pendingStartActivities,
      pendingStartDecision,
    };
  }, [wfExecutionDescription]);

  const eventGroups = useMemo(
    () => groupHistoryEvents(events, pendingHistoryEvents),
    [events, pendingHistoryEvents]
  );

  const filteredEventGroupsEntries = useMemo(
    () =>
      sortBy(
        Object.entries(eventGroups),
        ([_, { firstEventId }]) => getSortableEventId(firstEventId),
        'ASC'
      ).filter(([_, g]) =>
        workflowHistoryFiltersConfig.every((f) =>
          f.filterFunc(g, {
            historyEventTypes: queryParams.historyEventTypes,
            historyEventStatuses: queryParams.historyEventStatuses,
          })
        )
      ),
    [
      eventGroups,
      queryParams.historyEventTypes,
      queryParams.historyEventStatuses,
    ]
  );

  const sortedUngroupedEvents: Array<WorkflowHistoryUngroupedEventInfo> =
    useMemo(
      () =>
        filteredEventGroupsEntries
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
      [filteredEventGroupsEntries]
    );

  const [visibleGroupsRange, setTimelineListVisibleRange] =
    useThrottledState<VisibleHistoryGroupRanges>({
      startIndex: -1,
      endIndex: -1,
      compactStartIndex: -1,
      compactEndIndex: -1,
      ungroupedStartIndex: -1,
      ungroupedEndIndex: -1,
    });

  const onClickGroupModeToggle = useCallback(() => {
    setUngroupedViewUserPreference(!isUngroupedHistoryViewEnabled);

    setQueryParams({
      ungroupedHistoryViewEnabled: isUngroupedHistoryViewEnabled
        ? 'false'
        : 'true',
    });

    setTimelineListVisibleRange(() => ({
      startIndex: -1,
      endIndex: -1,
      compactStartIndex: -1,
      compactEndIndex: -1,
      ungroupedStartIndex: -1,
      ungroupedEndIndex: -1,
    }));
  }, [
    isUngroupedHistoryViewEnabled,
    setQueryParams,
    setTimelineListVisibleRange,
    setUngroupedViewUserPreference,
  ]);

  const workflowCloseTimeMs = workflowExecutionInfo?.closeTime
    ? parseGrpcTimestamp(workflowExecutionInfo?.closeTime)
    : null;

  // search for the event selected in the URL on initial page load
  const {
    initialEventFound,
    initialEventGroupIndex,
    shouldSearchForInitialEvent,
  } = useInitialSelectedEvent({
    selectedEventId: queryParams.historySelectedEventId,
    events,
    filteredEventGroupsEntries,
  });

  const isLastPageEmpty =
    result.pages[result.pages.length - 1].history?.events.length === 0;

  const visibleGroupsHasMissingEvents = useMemo(() => {
    return getVisibleGroupsHasMissingEvents(
      filteredEventGroupsEntries,
      visibleGroupsRange
    );
  }, [filteredEventGroupsEntries, visibleGroupsRange]);

  const ungroupedViewShouldLoadMoreEvents = useMemo(
    () =>
      isUngroupedHistoryViewEnabled &&
      // Pre-load more as we're approaching the end
      sortedUngroupedEvents.length - visibleGroupsRange.ungroupedEndIndex <
        WORKFLOW_HISTORY_PAGE_SIZE_CONFIG * 1,
    [
      isUngroupedHistoryViewEnabled,
      sortedUngroupedEvents.length,
      visibleGroupsRange.ungroupedEndIndex,
    ]
  );

  const keepLoadingMoreEvents = useMemo(() => {
    if (shouldSearchForInitialEvent && !initialEventFound) return true;
    if (visibleGroupsHasMissingEvents) return true;
    if (ungroupedViewShouldLoadMoreEvents) return true;
    return false;
  }, [
    shouldSearchForInitialEvent,
    initialEventFound,
    visibleGroupsHasMissingEvents,
    ungroupedViewShouldLoadMoreEvents,
  ]);

  const { isLoadingMore, reachedAvailableHistoryEnd } = useKeepLoadingEvents({
    shouldKeepLoading: keepLoadingMoreEvents,
    stopAfterEndReached: true,
    continueLoadingAfterError: true,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLastPageEmpty,
    isFetchNextPageError,
  });

  const contentIsLoading =
    shouldSearchForInitialEvent && !initialEventFound && isLoadingMore;

  const {
    isExpandAllEvents,
    toggleIsExpandAllEvents,
    toggleIsEventExpanded,
    getIsEventExpanded,
  } = useEventExpansionToggle({
    visibleEvents: events,
    ...(queryParams.historySelectedEventId
      ? {
          initialState: {
            [queryParams.historySelectedEventId]: true,
          },
        }
      : {}),
  });

  const compactSectionListRef = useRef<VirtuosoHandle>(null);
  const timelineSectionListRef = useRef<VirtuosoHandle>(null);
  const ungroupedTableRef = useRef<VirtuosoHandle>(null);

  if (contentIsLoading) {
    return <SectionLoadingIndicator />;
  }

  return (
    <div className={cls.container}>
      <WorkflowHistoryHeader
        isExpandAllEvents={isExpandAllEvents}
        toggleIsExpandAllEvents={toggleIsExpandAllEvents}
        isUngroupedHistoryViewEnabled={isUngroupedHistoryViewEnabled}
        onClickGroupModeToggle={onClickGroupModeToggle}
        wfHistoryRequestArgs={wfHistoryRequestArgs}
        pageFiltersProps={{
          activeFiltersCount,
          queryParams,
          setQueryParams,
          ...pageFiltersRest,
        }}
        timelineChartProps={{
          eventGroupsEntries: filteredEventGroupsEntries,
          selectedEventId: queryParams.historySelectedEventId,
          isLoading:
            workflowExecutionInfo?.closeStatus ===
            'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID'
              ? !isLastPageEmpty
              : hasNextPage,
          hasMoreEvents: hasNextPage,
          isFetchingMoreEvents: isFetchingNextPage,
          fetchMoreEvents: fetchNextPage,
          onClickEventGroup: (eventGroupIndex) => {
            const eventId =
              filteredEventGroupsEntries[eventGroupIndex][1].events[0]
                .eventId || undefined;

            if (eventId) {
              setQueryParams({
                historySelectedEventId: eventId,
              });
            }

            if (!isUngroupedHistoryViewEnabled) {
              compactSectionListRef.current?.scrollToIndex({
                index: eventGroupIndex,
                align: 'start',
                behavior: 'auto',
              });

              timelineSectionListRef.current?.scrollToIndex({
                index: eventGroupIndex,
                align: 'start',
                behavior: 'auto',
              });
            } else {
              const ungroupedEventIndex = sortedUngroupedEvents.findIndex(
                (eventInfo) => eventInfo.id === eventId
              );

              ungroupedTableRef.current?.scrollToIndex({
                index: ungroupedEventIndex,
                align: 'start',
                behavior: 'auto',
              });
            }
          },
        }}
      />
      <PageSection className={cls.contentSection}>
        {filteredEventGroupsEntries.length > 0 && (
          <>
            {isUngroupedHistoryViewEnabled ? (
              <section className={cls.ungroupedEventsContainer}>
                <WorkflowHistoryUngroupedTable
                  eventsInfo={sortedUngroupedEvents}
                  selectedEventId={queryParams.historySelectedEventId}
                  decodedPageUrlParams={decodedParams}
                  error={error}
                  hasMoreEvents={hasNextPage}
                  isFetchingMoreEvents={isFetchingNextPage}
                  fetchMoreEvents={fetchNextPage}
                  getIsEventExpanded={getIsEventExpanded}
                  toggleIsEventExpanded={toggleIsEventExpanded}
                  onVisibleRangeChange={({ startIndex, endIndex }) =>
                    setTimelineListVisibleRange((currentRanges) => ({
                      ...currentRanges,
                      ungroupedStartIndex: startIndex,
                      ungroupedEndIndex: endIndex,
                    }))
                  }
                  virtuosoRef={ungroupedTableRef}
                  onResetToEventId={setResetToDecisionEventId}
                />
              </section>
            ) : (
              <div className={cls.eventsContainer}>
                <div role="list" className={cls.compactSection}>
                  <Virtuoso
                    data={filteredEventGroupsEntries}
                    ref={compactSectionListRef}
                    rangeChanged={({ startIndex, endIndex }) =>
                      setTimelineListVisibleRange((currentRanges) => ({
                        ...currentRanges,
                        compactStartIndex: startIndex,
                        compactEndIndex: endIndex,
                      }))
                    }
                    {...(initialEventGroupIndex === undefined
                      ? {}
                      : {
                          initialTopMostItemIndex: initialEventGroupIndex,
                        })}
                    itemContent={(index, [groupId, group]) => (
                      <div role="listitem" className={cls.compactCardContainer}>
                        <WorkflowHistoryCompactEventCard
                          key={groupId}
                          {...group}
                          statusReady={
                            !group.hasMissingEvents ||
                            reachedAvailableHistoryEnd
                          }
                          workflowCloseStatus={
                            workflowExecutionInfo?.closeStatus
                          }
                          workflowIsArchived={
                            workflowExecutionInfo?.isArchived || false
                          }
                          workflowCloseTimeMs={workflowCloseTimeMs}
                          showLabelPlaceholder={!group.label}
                          selected={group.events.some(
                            (e) =>
                              e.eventId === queryParams.historySelectedEventId
                          )}
                          disabled={!Boolean(group.events[0].eventId)}
                          onClick={() => {
                            if (group.events[0].eventId)
                              setQueryParams({
                                historySelectedEventId: group.events[0].eventId,
                              });
                            timelineSectionListRef.current?.scrollToIndex({
                              index,
                              align: 'start',
                              behavior: 'auto',
                            });
                          }}
                        />
                      </div>
                    )}
                    endReached={() => {
                      if (!isFetchingNextPage && hasNextPage) fetchNextPage();
                    }}
                  />
                </div>
                <section className={cls.timelineSection}>
                  <Virtuoso
                    useWindowScroll
                    data={filteredEventGroupsEntries}
                    ref={timelineSectionListRef}
                    defaultItemHeight={160}
                    rangeChanged={({ startIndex, endIndex }) =>
                      setTimelineListVisibleRange((currentRanges) => ({
                        ...currentRanges,
                        startIndex,
                        endIndex,
                      }))
                    }
                    {...(initialEventGroupIndex === undefined
                      ? {}
                      : {
                          initialTopMostItemIndex: {
                            index: initialEventGroupIndex,
                            align: 'start',
                            behavior: 'auto',
                          },
                        })}
                    itemContent={(index, [groupId, group]) => (
                      <WorkflowHistoryTimelineGroup
                        key={groupId}
                        {...group}
                        showLoadingMoreEvents={
                          group.hasMissingEvents && !reachedAvailableHistoryEnd
                        }
                        resetToDecisionEventId={group.resetToDecisionEventId}
                        isLastEvent={
                          index === filteredEventGroupsEntries.length - 1
                        }
                        decodedPageUrlParams={decodedParams}
                        getIsEventExpanded={getIsEventExpanded}
                        onEventToggle={toggleIsEventExpanded}
                        onReset={() => {
                          if (group.resetToDecisionEventId) {
                            setResetToDecisionEventId(
                              group.resetToDecisionEventId
                            );
                          }
                        }}
                        selected={group.events.some(
                          (e) =>
                            e.eventId === queryParams.historySelectedEventId
                        )}
                        workflowCloseStatus={workflowExecutionInfo?.closeStatus}
                        workflowIsArchived={
                          workflowExecutionInfo?.isArchived || false
                        }
                        workflowCloseTimeMs={workflowCloseTimeMs}
                      />
                    )}
                    components={{
                      Footer: () => (
                        <WorkflowHistoryTimelineLoadMore
                          error={error}
                          fetchNextPage={fetchNextPage}
                          hasNextPage={hasNextPage}
                          isFetchingNextPage={isFetchingNextPage}
                        />
                      ),
                    }}
                  />
                </section>
              </div>
            )}
          </>
        )}
        {filteredEventGroupsEntries.length === 0 && (
          <div className={cls.noResultsContainer}>No Results</div>
        )}
        {resetToDecisionEventId && (
          <WorkflowActionsModal
            {...decodedParams}
            initialFormValues={{
              decisionFinishEventId: resetToDecisionEventId,
            }}
            action={resetWorkflowActionConfig}
            onClose={() => {
              setResetToDecisionEventId(undefined);
            }}
          />
        )}
      </PageSection>
    </div>
  );
}
