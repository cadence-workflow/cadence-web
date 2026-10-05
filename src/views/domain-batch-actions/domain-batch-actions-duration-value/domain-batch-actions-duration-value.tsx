'use client';
import { useEffect, useState } from 'react';

import formatTimeDiff from '@/utils/datetime/format-time-diff';

import { styled } from './domain-batch-actions-duration-value.styles';
import { type Props } from './domain-batch-actions-duration-value.types';

// While the batch action is RUNNING its end time is "now", so we re-render once
// a second to make the duration tick live. Completed actions have a fixed end
// time and render statically.
export default function DomainBatchActionDurationValue({ batchAction }: Props) {
  const isRunning = batchAction.status === 'RUNNING';
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const intervalId = setInterval(() => forceTick((tick) => tick + 1), 1000);
    return () => clearInterval(intervalId);
  }, [isRunning]);

  if (!batchAction.startTime) return '—';

  return (
    <styled.Duration>
      {formatTimeDiff(
        batchAction.startTime,
        isRunning ? null : batchAction.endTime ?? null,
        true
      )}
    </styled.Duration>
  );
}
