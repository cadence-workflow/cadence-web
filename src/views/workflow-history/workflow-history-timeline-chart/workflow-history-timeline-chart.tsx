import React, { useEffect, useMemo } from 'react';

import { Tag, VARIANT, KIND } from 'baseui/tag';
// @ts-expect-error: react-visjs-timeline does not have type declarations available
import Timeline from 'react-visjs-timeline';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import { type HistoryEventsGroup } from '../workflow-history.types';

import convertEventGroupToTimelineChartItem from './helpers/convert-event-group-to-timeline-item';
import {
  cssStyles,
  overrides,
  styled,
} from './workflow-history-timeline-chart.styles';
import {
  type Props,
  type TimelineChartItem,
} from './workflow-history-timeline-chart.types';

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
      <Timeline
        options={{
          height: '400px',
          verticalScroll: true,
        }}
        items={timelineItems}
      />
    </styled.TimelineContainer>
  );
}
