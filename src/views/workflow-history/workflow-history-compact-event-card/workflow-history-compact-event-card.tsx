'use client';
import React, { Fragment } from 'react';

import { Badge } from 'baseui/badge';
import { Skeleton } from 'baseui/skeleton';
import { ALIGNMENT, TILE_KIND, Tile } from 'baseui/tile';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import WorkflowHistoryEventStatusBadge from '../workflow-history-event-status-badge/workflow-history-event-status-badge';
import WorkflowHistoryEventsDurationBadge from '../workflow-history-events-duration-badge/workflow-history-events-duration-badge';

import {
  cssStyles,
  overrides,
} from './workflow-history-compact-event-card.styles';
import { type Props } from './workflow-history-compact-event-card.types';

export default function WorkflowHistoryCompactEventCard({
  status,
  statusReady,
  label,
  showLabelPlaceholder,
  selected,
  disabled,
  timeMs,
  badges,
  closeTimeMs,
  events,
  hasMissingEvents,
  workflowCloseTimeMs,
  workflowCloseStatus,
  workflowIsArchived,
  onClick,
}: Props) {
  const { cls, theme } = useStyletronClasses(cssStyles);
  const hasBadges = badges !== undefined && badges.length > 0;

  return (
    <Tile
      overrides={overrides.title}
      tileKind={TILE_KIND.selection}
      headerAlignment={ALIGNMENT.right}
      bodyAlignment={ALIGNMENT.left}
      selected={selected}
      disabled={disabled}
      onClick={onClick}
    >
      <WorkflowHistoryEventStatusBadge
        status={status}
        statusReady={statusReady}
        size="small"
      />
      <div className={cls.textContainer}>
        {label && !showLabelPlaceholder && (
          <div className={cls.label}>
            {label}
            {hasBadges &&
              badges.map((badge) => (
                <Fragment key={badge.content}>
                  {' '}
                  <Badge
                    overrides={overrides.badge}
                    content={badge.content}
                    shape="rectangle"
                    color="primary"
                  />
                </Fragment>
              ))}
            {timeMs && (
              <>
                {' '}
                <WorkflowHistoryEventsDurationBadge
                  startTime={timeMs}
                  closeTime={closeTimeMs}
                  eventsCount={events.length}
                  hasMissingEvents={hasMissingEvents}
                  workflowCloseTime={workflowCloseTimeMs}
                  workflowIsArchived={workflowIsArchived}
                  workflowCloseStatus={workflowCloseStatus}
                  showOngoingOnly={true}
                />
              </>
            )}
          </div>
        )}
      </div>

      {showLabelPlaceholder && (
        <div className={cls.label}>
          <Skeleton
            rows={0}
            width="100px"
            height={theme.typography.LabelSmall.lineHeight.toString()}
          />
        </div>
      )}
    </Tile>
  );
}
