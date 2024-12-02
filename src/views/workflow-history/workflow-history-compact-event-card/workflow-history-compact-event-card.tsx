'use client';
import React from 'react';

import { Badge } from 'baseui/badge';
import { Skeleton } from 'baseui/skeleton';
import { ALIGNMENT, TILE_KIND, Tile } from 'baseui/tile';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import WorkflowHistoryEventStatusBadge from '../workflow-history-event-status-badge/workflow-history-event-status-badge';

import {
  cssStyles,
  overrides,
} from './workflow-history-compact-event-card.styles';
import { type Props } from './workflow-history-compact-event-card.types';

export default function WorkflowHistoryCompactEventCard({
  status,
  label,
  badges,
  showLabelPlaceholder,
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
      onClick={onClick}
    >
      <WorkflowHistoryEventStatusBadge status={status} size="small" />
      <div className={cls.textContainer}>
        {label && !showLabelPlaceholder && (
          <div className={cls.label}>
            {label}
            {hasBadges &&
              badges.map((badge) => (
                <>
                  {' '}
                  <Badge
                    key={badge.content}
                    overrides={overrides.badge}
                    content={badge.content}
                    shape="rectangle"
                    color="primary"
                  />
                </>
              ))}
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
