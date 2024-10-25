'use client';
import React from 'react';

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
  secondaryLabel,
  showLabelPlaceholder,
  onClick,
}: Props) {
  const { cls, theme } = useStyletronClasses(cssStyles);

  return (
    <Tile
      overrides={overrides.Tile}
      tileKind={TILE_KIND.selection}
      headerAlignment={ALIGNMENT.right}
      bodyAlignment={ALIGNMENT.left}
      onClick={onClick}
    >
      <WorkflowHistoryEventStatusBadge status={status} size="small" />
      <div className={cls.textContainer}>
        {label && !showLabelPlaceholder && (
          <div className={cls.label}>{label}</div>
        )}
        {showLabelPlaceholder && (
          <div className={cls.label}>
            <Skeleton
              rows={0}
              width="100px"
              height={theme.typography.LabelSmall.lineHeight.toString()}
            />
          </div>
        )}
        <div suppressHydrationWarning className={cls.secondaryLabel}>
          {secondaryLabel}
        </div>
      </div>
    </Tile>
  );
}
