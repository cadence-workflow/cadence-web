import { type BatchActionStatus } from '@/route-handlers/list-batch-actions/list-batch-actions.types';
import formatDuration from '@/utils/data-formatters/format-duration';

import { BATCH_ACTION_ETA_MINIMUM_ELAPSED_MS } from '../domain-batch-actions-progress-bar/domain-batch-actions-progress-bar.constants';

export default function getBatchActionEtaDuration({
  status,
  remaining,
  completed,
  startTime,
}: {
  status: BatchActionStatus;
  remaining: number;
  completed: number;
  startTime?: number;
}): string | null {
  const elapsedMs = startTime === undefined ? 0 : Date.now() - startTime;

  if (
    status !== 'RUNNING' ||
    remaining <= 0 ||
    completed <= 0 ||
    elapsedMs < BATCH_ACTION_ETA_MINIMUM_ELAPSED_MS
  ) {
    return null;
  }

  const remainingMs = (remaining * elapsedMs) / completed;

  return formatDuration(
    { seconds: String(remainingMs / 1000), nanos: 0 },
    { separator: ' ', minUnit: 's' }
  );
}
