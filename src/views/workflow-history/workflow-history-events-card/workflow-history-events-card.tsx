'use client';
import React from 'react';

import { StatelessAccordion, Panel } from 'baseui/accordion';
import { Skeleton } from 'baseui/skeleton';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import WorkflowHistoryEventDetails from '../workflow-history-event-details/workflow-history-event-details';
import WorkflowHistoryEventLinkButton from '../workflow-history-event-link-button/workflow-history-event-link-button';
import getBadgeContainerSize from '../workflow-history-event-status-badge/helpers/get-badge-container-size';
import WorkflowHistoryEventStatusBadge from '../workflow-history-event-status-badge/workflow-history-event-status-badge';

import {
  cssStyles,
  overrides as getOverrides,
} from './workflow-history-events-card.styles';
import { type Props } from './workflow-history-events-card.types';

export default function WorkflowHistoryEventsCard({
  events,
  eventsMetadata,
  showEventPlaceholder,
  decodedPageUrlParams,
  getIsEventExpanded,
  onEventToggle,
  animateBorderOnEnter,
}: Props) {
  const { cls, theme } = useStyletronClasses(cssStyles);

  if (!eventsMetadata?.length && !showEventPlaceholder) return null;
  const expanded = events.reduce((result, event) => {
    const id = event.eventId === null ? event.computedEventId : event.eventId;
    if (getIsEventExpanded(id)) result.push(id);
    return result;
  }, [] as string[]);
  const overrides = getOverrides(animateBorderOnEnter);

  return (
    <StatelessAccordion overrides={overrides.accordion} expanded={expanded}>
      {eventsMetadata?.map((eventMetadata, index) => {
        const event = events[index];
        const id =
          event.eventId === null ? event.computedEventId : event.eventId;
        const isPanelExpanded = expanded.includes(id);

        return (
          <Panel
            key={id}
            title={
              <div className={cls.eventPanelTitle}>
                <WorkflowHistoryEventStatusBadge
                  statusReady={true}
                  size="small"
                  status={eventMetadata.status}
                />
                <div className={cls.eventLabel}>
                  {eventMetadata.label}
                  {isPanelExpanded && (
                    <WorkflowHistoryEventLinkButton historyEventId={id} />
                  )}
                </div>
              </div>
            }
            onClick={() => onEventToggle(id)}
          >
            <WorkflowHistoryEventDetails
              event={event}
              decodedPageUrlParams={decodedPageUrlParams}
              negativeFields={eventMetadata.negativeFields}
              additionalDetails={eventMetadata.additionalDetails}
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
                animation
              />
              <Skeleton
                rows={0}
                width="100px"
                height={theme.typography.LabelSmall.lineHeight.toString()}
                animation
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
