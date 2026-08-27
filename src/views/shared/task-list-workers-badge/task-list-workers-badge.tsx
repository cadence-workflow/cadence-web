'use client';

import { Tag } from 'baseui/tag';
import { StatefulTooltip } from 'baseui/tooltip';

import getTaskListWorkersBadgeLabel from './helpers/get-task-list-workers-badge-label';
import { TASK_LIST_WORKERS_BADGE_TOOLTIPS } from './task-list-workers-badge.constants';
import { overrides } from './task-list-workers-badge.styles';
import { type Props } from './task-list-workers-badge.types';

export default function TaskListWorkersBadge({
  variant,
  count,
}: Props) {
  const label = getTaskListWorkersBadgeLabel({ variant, count });

  return (
    <StatefulTooltip
      content={TASK_LIST_WORKERS_BADGE_TOOLTIPS[variant]}
      showArrow
      accessibilityType="tooltip"
    >
      <span>
        <Tag
          kind={count === 0 ? 'negative' : 'accent'}
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
