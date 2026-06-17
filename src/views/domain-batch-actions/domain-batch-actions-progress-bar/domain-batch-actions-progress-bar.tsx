'use client';
import React from 'react';

import { ProgressBar } from 'baseui/progress-bar';

import {
  getProgressBarOverrides,
  styled,
} from './domain-batch-actions-progress-bar.styles';
import { type Props } from './domain-batch-actions-progress-bar.types';

export default function DomainBatchActionsProgressBar({
  status,
  progress,
}: Props) {
  const completed = progress ? progress.successCount + progress.errorCount : 0;
  const total = progress?.totalEstimate ?? 0;
  const hasProgress = total > 0;
  // Determinate bar once counts exist (running, completed, or failed with a last
  // known heartbeat); an indeterminate bar while a running batch has not reported
  // progress yet. Nothing otherwise.
  const showProgressBar =
    status === 'RUNNING' ||
    ((status === 'COMPLETED' || status === 'FAILED') && hasProgress);

  if (!showProgressBar) {
    return null;
  }

  if (!hasProgress) {
    return (
      <ProgressBar
        infinite
        showLabel
        getProgressLabel={() => 'Calculating progress…'}
        overrides={getProgressBarOverrides(status)}
      />
    );
  }

  return (
    <styled.Container>
      <ProgressBar
        value={completed}
        maxValue={total}
        showLabel
        size="large"
        getProgressLabel={() =>
          status === 'FAILED'
            ? `Stopped at ${completed} out of ${total} workflows`
            : `${completed} out of ${total} workflows completed`
        }
        overrides={getProgressBarOverrides(status)}
      />
      {/* TODO: render the success count (progress.successCount) and failed
          count (progress.errorCount) beneath the completed total once the
          design has been finalized. */}
    </styled.Container>
  );
}
