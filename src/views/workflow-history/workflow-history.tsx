'use client';
import React, { useMemo } from 'react';

import {
  useSuspenseInfiniteQuery,
  type InfiniteData,
} from '@tanstack/react-query';
import { HeadingXSmall } from 'baseui/typography';
import queryString from 'query-string';
import { Virtuoso } from 'react-virtuoso';

import PageSection from '@/components/page-section/page-section';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import { type GetWorkflowHistoryResponse } from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';
import sortBy from '@/utils/sort-by';
import type { WorkflowPageTabContentProps } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import { groupHistoryEvents } from './helpers/group-history-events';
import WorkflowHistoryCompactEventCard from './workflow-history-compact-event-card/workflow-history-compact-event-card';
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

  const groupedHistoryEvents = useMemo(() => {
    const events = workflowHistory
      .map(({ history }) => history?.events || [])
      .flat(1);
    return groupHistoryEvents(events);
  }, [workflowHistory]);

  const groupedHistoryEventsEntries = useMemo(() => {
    return sortBy(
      Object.entries(groupedHistoryEvents),
      ([_, { timeMs }]) => timeMs,
      'ASC'
    );
  }, [groupedHistoryEvents]);

  return (
    <PageSection>
      <div className={cls.pageContainer}>
        <HeadingXSmall>Workflow history</HeadingXSmall>
        <div className={cls.eventsContainer}>
          <div role="list" className={cls.compactSection}>
            <Virtuoso
              data={groupedHistoryEventsEntries}
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
              data={groupedHistoryEventsEntries}
              itemContent={(index, [groupId, group]) => (
                <WorkflowHistoryTimelineGroup
                  key={groupId}
                  status={group.status}
                  label={
                    group.label + index + groupedHistoryEventsEntries.length
                  }
                  timeLabel={group.timeLabel}
                  events={group.events}
                  eventsMetadata={group.eventsMetadata}
                  hasMissingEvents={group.hasMissingEvents}
                  isLastEvent={index === groupedHistoryEventsEntries.length - 1}
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
      </div>
    </PageSection>
  );
}
