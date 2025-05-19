'use client';
import React, { useState } from 'react';

import { StatelessAccordion, Panel } from 'baseui/accordion';
import { Button } from 'baseui/button';
import { Skeleton } from 'baseui/skeleton';
import { StatefulTooltip } from 'baseui/tooltip';
import copy from 'copy-to-clipboard';
import queryString from 'query-string';
import { MdLink } from 'react-icons/md';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import WorkflowHistoryEventDetails from '../workflow-history-event-details/workflow-history-event-details';
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

  const [isEventLinkCopied, setIsEventLinkCopied] = useState(false);

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
                    <StatefulTooltip
                      showArrow
                      placement="right"
                      popoverMargin={8}
                      accessibilityType="tooltip"
                      content={() =>
                        isEventLinkCopied
                          ? 'Copied link to event'
                          : 'Copy link to event'
                      }
                      onMouseLeave={() => setIsEventLinkCopied(false)}
                      returnFocus
                      autoFocus
                    >
                      <Button
                        data-testid="share-button"
                        size="mini"
                        shape="circle"
                        kind="tertiary"
                        overrides={overrides.shareButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          copy(
                            queryString.stringifyUrl({
                              url:
                                window.location.origin +
                                window.location.pathname,
                              query: {
                                he: id,
                              },
                            })
                          );
                          setIsEventLinkCopied(true);
                        }}
                      >
                        <MdLink />
                      </Button>
                    </StatefulTooltip>
                  )}
                </div>
              </div>
            }
            onClick={() => onEventToggle(id)}
          >
            <WorkflowHistoryEventDetails
              event={event}
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
