'use client';
import React from 'react';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import WorkflowHistoryEventStatusBadge from '../workflow-history-event-status-badge/workflow-history-event-status-badge';
import WorkflowHistoryEventsCard from '../workflow-history-events-card/workflow-history-events-card';

import { cssStyles, styled } from './workflow-history-timeline-group.styles';
import { type Props } from './workflow-history-timeline-group.types';

export default function WorkflowHistoryTimelineGroup({
  status,
  label,
  timeLabel,
  events,
  isLastEvent,
  eventsMetadata,
  hasMissingEvents,
  decodedPageUrlParams,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);

  return (
    <div className={cls.groupContainer}>
      <div className={cls.timelineEventHeader}>
        <WorkflowHistoryEventStatusBadge status={status} size="medium" />
        <div className={cls.timelineEventsLabel}>{label}</div>
        <div suppressHydrationWarning className={cls.timelineEventsTime}>
          {timeLabel}
        </div>
      </div>
      <div className={cls.timelineEventCardContainer}>
        <styled.VerticalDivider $hidden={isLastEvent} />
        <WorkflowHistoryEventsCard
          events={events}
          eventsMetadata={eventsMetadata}
          showEventPlaceholder={hasMissingEvents}
          decodedPageUrlParams={decodedPageUrlParams}
        />
      </div>
    </div>
  );
}
