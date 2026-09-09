'use client';

import { Skeleton } from 'baseui/skeleton';
import { Tag } from 'baseui/tag';
import { StatefulTooltip } from 'baseui/tooltip';

import getTaskListWorkersBadgeLabel from './helpers/get-task-list-workers-badge-label';
import { TASK_LIST_WORKERS_BADGE_TOOLTIPS } from './task-list-workers-badge.constants';
import { overrides } from './task-list-workers-badge.styles';
import { type Props } from './task-list-workers-badge.types';

export default function TaskListWorkersBadge({
  variant,
  count,
  isLoading,
}: Props) {
  if (isLoading) {
    return (
      <Skeleton
        height="20px"
        width="80px"
        overrides={overrides.skeleton}
        animation
      />
    );
  }

  const label = getTaskListWorkersBadgeLabel({ variant, count });
  const isZeroCount = variant !== 'sticky' && (count ?? 0) === 0;

  return (
    <StatefulTooltip
      content={TASK_LIST_WORKERS_BADGE_TOOLTIPS[variant]}
      showArrow
      accessibilityType="tooltip"
    >
      <span>
        <Tag
          kind={isZeroCount ? 'negative' : 'accent'}
          hierarchy="primary"
          closeable={false}
          overrides={overrides.tag}
        >
          {label}
        </Tag>
      </span>
    </StatefulTooltip>
  );
}
