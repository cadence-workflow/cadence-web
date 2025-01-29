'use client';
import React, { useEffect, useMemo } from 'react';

import { Tag, VARIANT, KIND } from 'baseui/tag';
import dynamic from 'next/dynamic';

import { type TimelineItem } from '@/components/timeline/timeline.types';
import useStyletronClasses from '@/hooks/use-styletron-classes';

import { type HistoryEventsGroup } from '../workflow-history.types';

import convertEventGroupToTimelineChartItem from './helpers/convert-event-group-to-timeline-item';
import {
  cssStyles,
  overrides,
  styled,
} from './workflow-history-timeline-chart.styles';
import { type Props } from './workflow-history-timeline-chart.types';

const Timeline = dynamic(() => import('@/components/timeline/timeline'), {
  ssr: false,
});

export default function WorkflowHistoryTimelineChart({
  eventGroups,
  isLoading,
  hasMoreEvents,
  fetchMoreEvents,
  isFetchingMoreEvents,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);

  useEffect(() => {
    if (hasMoreEvents && !isFetchingMoreEvents) fetchMoreEvents();
  }, [hasMoreEvents, isFetchingMoreEvents, fetchMoreEvents]);

  const timelineItems = useMemo(
    () =>
      eventGroups.reduce(
        (items: Array<TimelineItem>, group: HistoryEventsGroup) => {
          const timelineChartItem = convertEventGroupToTimelineChartItem(
            group,
            cls
          );
          timelineChartItem && items.push(timelineChartItem);
          return items;
        },
        []
      ),
    [eventGroups, cls]
  );

  return (
    <styled.TimelineContainer>
      {isLoading && (
        <styled.LoaderContainer>
          <Tag
            variant={VARIANT.solid}
            closeable={false}
            kind={KIND.accent}
            startEnhancer={styled.Spinner}
            overrides={overrides.tag}
          >
            Loading events
          </Tag>
        </styled.LoaderContainer>
      )}
      <Timeline items={timelineItems} />
    </styled.TimelineContainer>
  );
}
