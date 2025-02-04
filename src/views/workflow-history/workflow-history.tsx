'use client';
import React, { useMemo, useRef, useState } from 'react';

import {
  useSuspenseInfiniteQuery,
  type InfiniteData,
} from '@tanstack/react-query';
import { Button, KIND } from 'baseui/button';
import { HeadingXSmall } from 'baseui/typography';
import queryString from 'query-string';
import { MdSchedule } from 'react-icons/md';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';

import usePageFilters from '@/components/page-filters/hooks/use-page-filters';
import PageFiltersFields from '@/components/page-filters/page-filters-fields/page-filters-fields';
import PageFiltersToggle from '@/components/page-filters/page-filters-toggle/page-filters-toggle';
import PageSection from '@/components/page-section/page-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import { type GetWorkflowHistoryResponse } from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import decodeUrlParams from '@/utils/decode-url-params';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';
import sortBy from '@/utils/sort-by';

import workflowPageQueryParamsConfig from '../workflow-page/config/workflow-page-query-params.config';
import useDescribeWorkflow from '../workflow-page/hooks/use-describe-workflow';

import workflowHistoryFiltersConfig from './config/workflow-history-filters.config';
import { groupHistoryEvents } from './helpers/group-history-events';
import useEventExpansionToggle from './hooks/use-event-expansion-toggle';
import useInitialSelectedEvent from './hooks/use-initial-selected-event';
import useKeepLoadingEvents from './hooks/use-keep-loading-events';
import WorkflowHistoryCompactEventCard from './workflow-history-compact-event-card/workflow-history-compact-event-card';
import WorkflowHistoryExpandAllEventsButton from './workflow-history-expand-all-events-button/workflow-history-expand-all-events-button';
import WorkflowHistoryExportJsonButton from './workflow-history-export-json-button/workflow-history-export-json-button';
import WorkflowHistoryTimelineChart from './workflow-history-timeline-chart/workflow-history-timeline-chart';
import WorkflowHistoryTimelineGroup from './workflow-history-timeline-group/workflow-history-timeline-group';
import WorkflowHistoryTimelineLoadMore from './workflow-history-timeline-load-more/workflow-history-timeline-load-more';
import { cssStyles, overrides } from './workflow-history.styles';
import { type Props } from './workflow-history.types';

export default function WorkflowHistory({ params }: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const decodedParams = decodeUrlParams<Props['params']>(params);

  const { workflowTab, ...historyQueryParams } = params;
  const wfhistoryRequestArgs = {
    ...historyQueryParams,
    pageSize: 200,
    waitForNewEvent: 'true',
  };

  const {
    activeFiltersCount,
    queryParams,
    setQueryParams,
    ...pageFiltersRest
  } = usePageFilters({
    pageQueryParamsConfig: workflowPageQueryParamsConfig,
    pageFiltersConfig: workflowHistoryFiltersConfig,
  });

  const {
    data: { workflowExecutionInfo },
  } = useDescribeWorkflow({ ...params });

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
    [string, typeof wfhistoryRequestArgs],
    string | undefined
  >({
    queryKey: ['workflow_history_paginated', wfhistoryRequestArgs] as const,
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

  const filteredEvents = useMemo(
    () =>
      events.filter((event) =>
        workflowHistoryFiltersConfig.every((f) => {
          if (f.filterTarget === 'event')
            return f.filterFunc(event, queryParams);
          return true;
        })
      ),
    [queryParams, events]
  );

  const eventGroups = useMemo(
    () => groupHistoryEvents(filteredEvents),
    [filteredEvents]
  );

  const filteredEventGroupsEntries = useMemo(
    () =>
      sortBy(
        Object.entries(eventGroups),
        ([_, { timeMs }]) => timeMs,
        'ASC'
      ).filter(([_, g]) =>
        workflowHistoryFiltersConfig.every((f) =>
          f.filterTarget === 'group' ? f.filterFunc(g, queryParams) : true
        )
      ),
    [eventGroups, queryParams]
  );

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

  const keepLoadingMoreEvents = useMemo(() => {
    if (shouldSearchForInitialEvent && !initialEventFound) return true;
    return false;
  }, [shouldSearchForInitialEvent, initialEventFound]);

  const { isLoadingMore } = useKeepLoadingEvents({
    shouldKeepLoading: keepLoadingMoreEvents,
    stopAfterEndReached: true,
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
  });

  const [isTimelineChartShown, setIsTimelineChartShown] = useState(false);

  const timelineSectionListRef = useRef<VirtuosoHandle>(null);

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
          <WorkflowHistoryExportJsonButton {...wfhistoryRequestArgs} />
          <PageFiltersToggle
            activeFiltersCount={activeFiltersCount}
            onClick={() => setAreFiltersShown((v) => !v)}
            isActive={areFiltersShown}
          />
          <Button
            $size="compact"
            kind={isTimelineChartShown ? KIND.primary : KIND.secondary}
            onClick={() => setIsTimelineChartShown((v) => !v)}
            startEnhancer={<MdSchedule size={16} />}
            overrides={overrides.timelineToggleButton}
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
          isLoading={
            workflowExecutionInfo?.closeStatus ===
            'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID'
              ? !isLastPageEmpty
              : hasNextPage
          }
          hasMoreEvents={hasNextPage}
          isFetchingMoreEvents={isFetchingNextPage}
          fetchMoreEvents={fetchNextPage}
        />
      )}
      {filteredEventGroupsEntries.length > 0 && (
        <div className={cls.eventsContainer}>
          <div role="list" className={cls.compactSection}>
            <Virtuoso
              data={filteredEventGroupsEntries}
              {...(initialEventGroupIndex === undefined
                ? {}
                : {
                    initialTopMostItemIndex: initialEventGroupIndex,
                  })}
              itemContent={(
                index,
                [groupId, { label, status, timeLabel, badges, events }]
              ) => (
                <div role="listitem" className={cls.compactCardContainer}>
                  <WorkflowHistoryCompactEventCard
                    key={groupId}
                    status={status}
                    label={label}
                    secondaryLabel={timeLabel}
                    showLabelPlaceholder={!label}
                    badges={badges}
                    selected={
                      queryParams.historySelectedEventId === events[0].eventId
                    }
                    onClick={() => {
                      setQueryParams({
                        historySelectedEventId: events[0].eventId,
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
                  status={group.status}
                  label={group.label}
                  timeLabel={group.timeLabel}
                  events={group.events}
                  eventsMetadata={group.eventsMetadata}
                  badges={group.badges}
                  hasMissingEvents={group.hasMissingEvents}
                  isLastEvent={index === filteredEventGroupsEntries.length - 1}
                  decodedPageUrlParams={decodedParams}
                  getIsEventExpanded={getIsEventExpanded}
                  onEventToggle={toggleIsEventExpanded}
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
      {filteredEventGroupsEntries.length === 0 && (
        <div className={cls.noResultsContainer}>No Results</div>
      )}
    </PageSection>
  );
}
