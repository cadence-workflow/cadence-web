'use client';
import React from 'react';

import { Accordion, Panel } from 'baseui/accordion';
import { Skeleton } from 'baseui/skeleton';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import getBadgeContainerSize from '../workflow-history-event-status-badge/helpers/get-badge-container-size';
import WorkflowHistoryEventStatusBadge from '../workflow-history-event-status-badge/workflow-history-event-status-badge';

import { cssStyles, overrides } from './workflow-history-events-card.styles';
import { type Props } from './workflow-history-events-card.types';

export default function WorkflowHistoryEventsCard({
  eventsMetadata,
  showMissingEventPlaceholder,
}: Props) {
  const { cls, theme } = useStyletronClasses(cssStyles);

  if (!eventsMetadata?.length && !showMissingEventPlaceholder) return null;
  return (
    <Accordion overrides={overrides.accordion} accordion>
      {eventsMetadata?.map((event, index) => {
        return (
          <Panel
            key={`${event.label}-${index}`}
            title={
              <>
                <WorkflowHistoryEventStatusBadge
                  size="small"
                  status={event.status}
                />
                <div className={cls.eventLabel}>{event.label}</div>
              </>
            }
          >
            {`Placeholder text ${index}`}
          </Panel>
        );
      })}
      {showMissingEventPlaceholder && (
        <Panel
          disabled
          title={
            <div className={cls.skeletonContainer}>
              <Skeleton
                width={getBadgeContainerSize(theme, 'small')}
                height={getBadgeContainerSize(theme, 'small')}
                overrides={{
                  Root: {
                    style: {
                      borderRadius: '50%',
                    },
                  },
                }}
              />
              <Skeleton
                rows={0}
                width="100px"
                height={theme.typography.LabelSmall.lineHeight.toString()}
              />
            </div>
          }
        ><></></Panel>
      )}
    </Accordion>
  );
}