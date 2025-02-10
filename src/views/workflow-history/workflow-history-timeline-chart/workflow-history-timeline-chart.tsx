'use client';
import React, { useEffect, useMemo } from 'react';

import { Tag, VARIANT, KIND } from 'baseui/tag';
import dynamic from 'next/dynamic';

import { type TimelineItem } from '@/components/timeline/timeline.types';
import useStyletronClasses from '@/hooks/use-styletron-classes';

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
  eventGroupsEntries,
  selectedEventId,
  isLoading,
  hasMoreEvents,
  fetchMoreEvents,
  isFetchingMoreEvents,
  onClickEventGroup,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);

  useEffect(() => {
    if (hasMoreEvents && !isFetchingMoreEvents) fetchMoreEvents();
  }, [hasMoreEvents, isFetchingMoreEvents, fetchMoreEvents]);

  const timelineItems = useMemo(
    () =>
      eventGroupsEntries.reduce(
        (items: Array<TimelineItem>, [_, group], index) => {
          const timelineChartItem = convertEventGroupToTimelineChartItem({
            group,
            index,
            classes: cls,
            isSelected: group.events[0].eventId === selectedEventId,
          });

          if (timelineChartItem) {
            items.push(timelineChartItem);
          }

          return items;
        },
        []
      ),
    [eventGroupsEntries, cls, selectedEventId]
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
      <Timeline items={timelineItems} onClickItem={onClickEventGroup} />
    </styled.TimelineContainer>
  );
}
