import { type TaskListWorkersBadgeVariant } from '../task-list-workers-badge.types';

export default function getTaskListWorkersBadgeLabel({
  variant,
  count,
}: {
  variant: TaskListWorkersBadgeVariant;
  count?: number;
}): string {
  if (variant === 'sticky') return 'Sticky';

  const n = count ?? 0;
  if (variant === 'decision') {
    return n === 1 ? '1 decision handler' : `${n} decision handlers`;
  }
  if (variant === 'activity') {
    return n === 1 ? '1 activity handler' : `${n} activity handlers`;
  }
  return n === 1 ? '1 worker' : `${n} workers`;
}
