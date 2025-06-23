'use client';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import {
  useSuspenseInfiniteQuery,
  type InfiniteData,
} from '@tanstack/react-query';
import { Button } from 'baseui/button';
import { HeadingXSmall } from 'baseui/typography';
import queryString from 'query-string';
import {
  MdOutlineViewStream,
  MdOutlineViewAgenda,
  MdSchedule,
} from 'react-icons/md';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';

import usePageFilters from '@/components/page-filters/hooks/use-page-filters';
import PageFiltersFields from '@/components/page-filters/page-filters-fields/page-filters-fields';
import PageFiltersToggle from '@/components/page-filters/page-filters-toggle/page-filters-toggle';
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
import getVisibleGroupsHasMissingEvents from './helpers/get-visible-groups-has-missing-events';
import { groupHistoryEvents } from './helpers/group-history-events';
import pendingActivitiesInfoToEvents from './helpers/pending-activities-info-to-events';
import pendingDecisionInfoToEvent from './helpers/pending-decision-info-to-event';
import useEventExpansionToggle from './hooks/use-event-expansion-toggle';
import useInitialSelectedEvent from './hooks/use-initial-selected-event';
import useKeepLoadingEvents from './hooks/use-keep-loading-events';
import WorkflowHistoryCompactEventCard from './workflow-history-compact-event-card/workflow-history-compact-event-card';
import WorkflowHistoryExpandAllEventsButton from './workflow-history-expand-all-events-button/workflow-history-expand-all-events-button';
import WorkflowHistoryExportJsonButton from './workflow-history-export-json-button/workflow-history-export-json-button';
import WorkflowHistoryTimelineChart from './workflow-history-timeline-chart/workflow-history-timeline-chart';
import WorkflowHistoryTimelineGroup from './workflow-history-timeline-group/workflow-history-timeline-group';
import WorkflowHistoryTimelineLoadMore from './workflow-history-timeline-load-more/workflow-history-timeline-load-more';
import { type WorkflowHistoryUngroupedEventInfo } from './workflow-history-ungrouped-event/workflow-history-ungrouped-event.types';
import WorkflowHistoryUngroupedTable from './workflow-history-ungrouped-table/workflow-history-ungrouped-table';
import { cssStyles, overrides } from './workflow-history.styles';
import {
  type VisibleHistoryGroupRanges,
  type ExtendedHistoryEvent,
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
  const shouldFilterEvent = useCallback(
    (event: ExtendedHistoryEvent) => {
      return workflowHistoryFiltersConfig.every((f) => {
        if (f.filterTarget === 'event')
          return f.filterFunc(event, {
            // TODO @assem.hafez: Revert to passing all the query params once history page performance is fixed
            // Test by switching between the Grouped & Ungrouped view
            historyEventTypes: queryParams.historyEventTypes,
            historyEventStatuses: queryParams.historyEventStatuses,
          });
        return true;
      });
    },
    [queryParams.historyEventStatuses, queryParams.historyEventTypes]
  );

  const filteredEvents = useMemo(
    () => events.filter(shouldFilterEvent),
    [shouldFilterEvent, events]
  );

  const filteredPendingHistoryEvents = useMemo(() => {
    const pendingStartActivities = pendingActivitiesInfoToEvents(
      wfExecutionDescription.pendingActivities
    ).filter(shouldFilterEvent);
    let pendingStartDecision = wfExecutionDescription.pendingDecision
      ? pendingDecisionInfoToEvent(wfExecutionDescription.pendingDecision)
      : null;
    if (pendingStartDecision !== null) {
      const decisionMatchesFilters = shouldFilterEvent(pendingStartDecision);
      if (!decisionMatchesFilters) pendingStartDecision = null;
    }
    return {
      pendingStartActivities,
      pendingStartDecision,
    };
  }, [shouldFilterEvent, wfExecutionDescription]);

  const eventGroups = useMemo(
    () => groupHistoryEvents(filteredEvents, filteredPendingHistoryEvents),
    [filteredEvents, filteredPendingHistoryEvents]
  );

  const filteredEventGroupsEntries = useMemo(
    () =>
      sortBy(
        Object.entries(eventGroups),
        ([_, { timeMs }]) => timeMs,
        'ASC'
      ).filter(([_, g]) =>
        workflowHistoryFiltersConfig.every((f) =>
          f.filterTarget === 'group'
            ? f.filterFunc(g, {
                historyEventTypes: queryParams.historyEventTypes,
                historyEventStatuses: queryParams.historyEventStatuses,
              })
            : true
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
              label: group.label,
              shortLabel: group.shortLabel,
              status: group.eventsMetadata[index].status,
              statusLabel: group.eventsMetadata[index].label,
              id: event.eventId ?? event.computedEventId,
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
    setQueryParams({
      ungroupedHistoryViewEnabled: queryParams.ungroupedHistoryViewEnabled
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
    queryParams.ungroupedHistoryViewEnabled,
    setQueryParams,
    setTimelineListVisibleRange,
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
      queryParams.ungroupedHistoryViewEnabled &&
      // Pre-load more as we're approaching the end
      sortedUngroupedEvents.length - visibleGroupsRange.ungroupedEndIndex <
        WORKFLOW_HISTORY_PAGE_SIZE_CONFIG * 1,
    [
      queryParams.ungroupedHistoryViewEnabled,
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

  const [areFiltersShown, setAreFiltersShown] = useState(true);
  const {
    isExpandAllEvents,
    toggleIsExpandAllEvents,
    toggleIsEventExpanded,
    getIsEventExpanded,
  } = useEventExpansionToggle({
    visibleEvents: filteredEvents,
    ...(queryParams.historySelectedEventId
      ? {
          initialState: {
            [queryParams.historySelectedEventId]: true,
          },
        }
      : {}),
  });

  const [isTimelineChartShown, setIsTimelineChartShown] = useState(false);

  const compactSectionListRef = useRef<VirtuosoHandle>(null);
  const timelineSectionListRef = useRef<VirtuosoHandle>(null);
  const ungroupedTableRef = useRef<VirtuosoHandle>(null);

  if (contentIsLoading) {
    return <SectionLoadingIndicator />;
  }

  return (
    <PageSection className={cls.pageContainer}>
      <div className={cls.pageHeader}>
        <HeadingXSmall>Workflow history</HeadingXSmall>
        <div className={cls.headerActions}>
          <WorkflowHistoryExpandAllEventsButton
            isExpandAllEvents={isExpandAllEvents}
            toggleIsExpandAllEvents={toggleIsExpandAllEvents}
          />
          <Button
            $size="compact"
            kind="secondary"
            onClick={onClickGroupModeToggle}
            startEnhancer={
              queryParams.ungroupedHistoryViewEnabled ? (
                <MdOutlineViewStream size={16} />
              ) : (
                <MdOutlineViewAgenda size={16} />
              )
            }
            overrides={overrides.toggleButton}
          >
            {queryParams.ungroupedHistoryViewEnabled ? 'Group' : 'Ungroup'}
          </Button>
          <WorkflowHistoryExportJsonButton {...wfHistoryRequestArgs} />
          <PageFiltersToggle
            activeFiltersCount={activeFiltersCount}
            onClick={() => setAreFiltersShown((v) => !v)}
            isActive={areFiltersShown}
          />
          <Button
            $size="compact"
            kind={isTimelineChartShown ? 'primary' : 'secondary'}
            onClick={() => setIsTimelineChartShown((v) => !v)}
            startEnhancer={<MdSchedule size={16} />}
            overrides={overrides.toggleButton}
          >
            Timeline
          </Button>
        </div>
      </div>
      {areFiltersShown && (
        <PageFiltersFields
          pageFiltersConfig={workflowHistoryFiltersConfig}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          {...pageFiltersRest}
        />
      )}
      {typeof window !== 'undefined' && isTimelineChartShown && (
        <WorkflowHistoryTimelineChart
          eventGroupsEntries={filteredEventGroupsEntries}
          selectedEventId={queryParams.historySelectedEventId}
          isLoading={
            workflowExecutionInfo?.closeStatus ===
            'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID'
              ? !isLastPageEmpty
              : hasNextPage
          }
          hasMoreEvents={hasNextPage}
          isFetchingMoreEvents={isFetchingNextPage}
          fetchMoreEvents={fetchNextPage}
          onClickEventGroup={(eventGroupIndex) => {
            const eventId =
              filteredEventGroupsEntries[eventGroupIndex][1].events[0]
                .eventId || undefined;

            if (eventId) {
              setQueryParams({
                historySelectedEventId: eventId,
              });
            }

            if (!queryParams.ungroupedHistoryViewEnabled) {
              compactSectionListRef.current?.scrollToIndex({
                index: eventGroupIndex,
                align: 'start',
                behavior: 'smooth',
              });

              timelineSectionListRef.current?.scrollToIndex({
                index: eventGroupIndex,
                align: 'start',
                behavior: 'smooth',
              });
            } else {
              const ungroupedEventIndex = sortedUngroupedEvents.findIndex(
                (eventInfo) => eventInfo.id === eventId
              );

              ungroupedTableRef.current?.scrollToIndex({
                index: ungroupedEventIndex,
                align: 'start',
                behavior: 'smooth',
              });
            }
          }}
        />
      )}
      {filteredEventGroupsEntries.length > 0 && (
        <>
          {queryParams.ungroupedHistoryViewEnabled ? (
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
                          !group.hasMissingEvents || reachedAvailableHistoryEnd
                        }
                        workflowCloseStatus={workflowExecutionInfo?.closeStatus}
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
                            behavior: 'smooth',
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
                          behavior: 'smooth',
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
                        (e) => e.eventId === queryParams.historySelectedEventId
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
  );
}
