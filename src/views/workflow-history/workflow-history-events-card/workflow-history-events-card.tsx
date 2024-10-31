'use client';
import React from 'react';

import { StatelessAccordion, Panel } from 'baseui/accordion';
import { Skeleton } from 'baseui/skeleton';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import WorkflowHistoryEventDetails from '../workflow-history-event-details/workflow-history-event-details';
import getBadgeContainerSize from '../workflow-history-event-status-badge/helpers/get-badge-container-size';
import WorkflowHistoryEventStatusBadge from '../workflow-history-event-status-badge/workflow-history-event-status-badge';

import { cssStyles, overrides } from './workflow-history-events-card.styles';
import { type Props } from './workflow-history-events-card.types';

export default function WorkflowHistoryEventsCard({
  events,
  eventsMetadata,
  showEventPlaceholder,
  decodedPageUrlParams,
  getIsEventExpanded,
  onEventToggle,
}: Props) {
  const { cls, theme } = useStyletronClasses(cssStyles);

  if (!eventsMetadata?.length && !showEventPlaceholder) return null;
  const expanded = events.reduce((result, { eventId }) => {
    if (getIsEventExpanded(eventId)) result.push(eventId);
    return result;
  }, [] as string[]);

  return (
    <StatelessAccordion overrides={overrides.accordion} expanded={expanded}>
      {eventsMetadata?.map((event, index) => {
        return (
          <Panel
            key={events[index].eventId}
            title={
              <>
                <WorkflowHistoryEventStatusBadge
                  size="small"
                  status={event.status}
                />
                <div className={cls.eventLabel}>{event.label}</div>
              </>
            }
            onClick={() => onEventToggle(events[index].eventId)}
          >
            <WorkflowHistoryEventDetails
              event={events[index]}
              decodedPageUrlParams={decodedPageUrlParams}
            />
          </Panel>
        );
      })}
      {showEventPlaceholder && (
        <Panel
          disabled
          title={
            <div className={cls.skeletonContainer}>
              <Skeleton
                width={getBadgeContainerSize(theme, 'small')}
                height={getBadgeContainerSize(theme, 'small')}
                overrides={overrides.circularSkeleton}
              />
              <Skeleton
                rows={0}
                width="100px"
                height={theme.typography.LabelSmall.lineHeight.toString()}
              />
            </div>
          }
        >
          <></>
        </Panel>
      )}
    </StatelessAccordion>
  );
}
