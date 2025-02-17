'use client';
import React, { useMemo, useState } from 'react';

import {
  useSuspenseInfiniteQuery,
  type InfiniteData,
} from '@tanstack/react-query';
import { HeadingXSmall } from 'baseui/typography';
import queryString from 'query-string';
import { Virtuoso } from 'react-virtuoso';

import usePageFilters from '@/components/page-filters/hooks/use-page-filters';
import PageFiltersFields from '@/components/page-filters/page-filters-fields/page-filters-fields';
import PageFiltersToggle from '@/components/page-filters/page-filters-toggle/page-filters-toggle';
import PageSection from '@/components/page-section/page-section';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import { type GetWorkflowHistoryResponse } from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';
import sortBy from '@/utils/sort-by';
import type { WorkflowPageTabContentProps } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import workflowPageQueryParamsConfig from '../workflow-page/config/workflow-page-query-params.config';

import workflowHistoryFiltersConfig from './config/workflow-history-filters.config';
import { groupHistoryEvents } from './helpers/group-history-events';
import WorkflowHistoryCompactEventCard from './workflow-history-compact-event-card/workflow-history-compact-event-card';
import WorkflowHistoryExportJsonButton from './workflow-history-export-json-button/workflow-history-export-json-button';
import WorkflowHistoryTimelineGroup from './workflow-history-timeline-group/workflow-history-timeline-group';
import WorkflowHistoryTimelineLoadMore from './workflow-history-timeline-load-more/workflow-history-timeline-load-more';
import { cssStyles } from './workflow-history.styles';

export default function WorkflowHistory({
  params,
}: WorkflowPageTabContentProps) {
  const { cls } = useStyletronClasses(cssStyles);

  const { workflowTab, ...historyQueryParams } = params;
  const wfhistoryRequestArgs = {
    ...historyQueryParams,
    pageSize: 200,
    waitForNewEvent: 'true',
  };

  const { activeFiltersCount, queryParams, ...pageFiltersRest } =
    usePageFilters({
      pageQueryParamsConfig: workflowPageQueryParamsConfig,
      pageFiltersConfig: workflowHistoryFiltersConfig,
    });

  const {
    data: result,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
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
        `/api/domains/${qp.domain}/${qp.cluster}/workflows/${qp.workflowId}/${qp.runId}/history?${queryString.stringify({ pageSize: qp.pageSize, nextPage: pageParam, waitForNewEvent: qp.waitForNewEvent })}`
      ).then((res) => res.json()),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.nextPageToken) return undefined;
      return lastPage?.nextPageToken;
    },
  });

  const workflowHistory = useMemo(() => {
    return (result.pages || []).flat(1);
  }, [result]);

  const filteredEvents = useMemo(() => {
    const events = workflowHistory
      .map(({ history }) => history?.events || [])
      .flat(1);
    return events.filter((event) =>
      workflowHistoryFiltersConfig.every((f) => {
        if (f.filterTarget === 'event') return f.filterFunc(event, queryParams);
        return true;
      })
    );
  }, [workflowHistory, queryParams]);

  const groupedHistoryEvents = useMemo(() => {
    return groupHistoryEvents(filteredEvents);
  }, [filteredEvents]);

  const filteredGroupedHistoryEventsEntries = useMemo(() => {
    return sortBy(
      Object.entries(groupedHistoryEvents),
      ([_, { timeMs }]) => timeMs,
      'ASC'
    ).filter(([_, g]) => {
      return workflowHistoryFiltersConfig.every((f) => {
        if (f.filterTarget === 'group') return f.filterFunc(g, queryParams);
        return true;
      });
    });
  }, [groupedHistoryEvents, queryParams]);

  const [areFiltersShown, setAreFiltersShown] = useState(false);

  return (
    <PageSection className={cls.pageContainer}>
      <div className={cls.pageHeader}>
        <HeadingXSmall>Workflow history</HeadingXSmall>
        <div className={cls.headerActions}>
          <WorkflowHistoryExportJsonButton {...wfhistoryRequestArgs} />
          <PageFiltersToggle
            activeFiltersCount={activeFiltersCount}
            onClick={() => setAreFiltersShown((v) => !v)}
            isActive={areFiltersShown}
          />
        </div>
      </div>
      {areFiltersShown && (
        <PageFiltersFields
          pageFiltersConfig={workflowHistoryFiltersConfig}
          queryParams={queryParams}
          {...pageFiltersRest}
        />
      )}
      {filteredGroupedHistoryEventsEntries.length > 0 && (
        <div className={cls.eventsContainer}>
          <div role="list" className={cls.compactSection}>
            <Virtuoso
              data={filteredGroupedHistoryEventsEntries}
              itemContent={(_, [groupId, { label, status, timeLabel }]) => (
                <div role="listitem" className={cls.compactCardContainer}>
                  <WorkflowHistoryCompactEventCard
                    key={groupId}
                    status={status}
                    label={label}
                    secondaryLabel={timeLabel}
                    showLabelPlaceholder={!label}
                  />
                </div>
              )}
            />
          </div>
          <section className={cls.timelineSection}>
            <Virtuoso
              useWindowScroll
              data={filteredGroupedHistoryEventsEntries}
              itemContent={(index, [groupId, group]) => (
                <WorkflowHistoryTimelineGroup
                  key={groupId}
                  status={group.status}
                  label={group.label}
                  timeLabel={group.timeLabel}
                  events={group.events}
                  eventsMetadata={group.eventsMetadata}
                  hasMissingEvents={group.hasMissingEvents}
                  isLastEvent={
                    index === filteredGroupedHistoryEventsEntries.length - 1
                  }
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
      {filteredGroupedHistoryEventsEntries.length === 0 && (
        <div className={cls.noResultsContainer}>No Results</div>
      )}
    </PageSection>
  );
}
