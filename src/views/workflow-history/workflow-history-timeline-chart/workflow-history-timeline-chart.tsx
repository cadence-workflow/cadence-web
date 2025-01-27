import React, { useEffect, useMemo, useState } from 'react';

import { Skeleton } from 'baseui/skeleton';
// @ts-expect-error: react-visjs-timeline does not have type declarations available
import Timeline from 'react-visjs-timeline';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import { type HistoryEventsGroup } from '../workflow-history.types';

import convertEventGroupToTimelineChartItem from './helpers/convert-event-group-to-timeline-item';
import { cssStyles, overrides } from './workflow-history-timeline-chart.styles';
import {
  type Props,
  type TimelineChartItem,
} from './workflow-history-timeline-chart.types';

export default function WorkflowHistoryTimelineChart({
  eventGroups,
  isInitialLoading,
  hasMoreEvents,
  fetchMoreEvents,
  isFetchingMoreEvents,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);

  useEffect(() => {
    if (hasMoreEvents && !isFetchingMoreEvents) fetchMoreEvents();
  }, [hasMoreEvents, isFetchingMoreEvents, fetchMoreEvents]);

  const [isLoading, setIsLoading] = useState(isInitialLoading);

  useEffect(() => {
    if (!isInitialLoading) {
      setIsLoading(false);
    }
  }, [isInitialLoading]);

  const timelineItems = useMemo(
    () =>
      eventGroups.reduce(
        (items: Array<TimelineChartItem>, group: HistoryEventsGroup) => {
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

  if (isLoading) {
    return <Skeleton animation height="400px" overrides={overrides.skeleton} />;
  }

  return (
    <Timeline
      options={{
        height: '400px',
        verticalScroll: true,
      }}
      items={timelineItems}
    />
  );
}
