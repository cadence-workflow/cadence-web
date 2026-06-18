'use client';
import React from 'react';

import { useStyletron } from 'baseui';
import { mergeOverrides } from 'baseui/helpers/overrides';
import { ProgressBar } from 'baseui/progress-bar';
import { MdCheckCircle, MdHourglassTop, MdWarning } from 'react-icons/md';

import getStatIconColor from '../helpers/get-stat-icon-color';
import getStatusBackgroundColor from '../helpers/get-status-background-color';

import {
  BATCH_ACTION_PROGRESS_VERB,
  DEFAULT_BATCH_ACTION_PROGRESS_VERB,
} from './domain-batch-actions-progress-bar.constants';
import { overrides, styled } from './domain-batch-actions-progress-bar.styles';
import { type Props } from './domain-batch-actions-progress-bar.types';

export default function DomainBatchActionsProgressBar({
  status,
  progress,
  actionType,
}: Props) {
  const [, theme] = useStyletron();

  // Status drives the bar color, so merge it onto the static overrides here.
  const progressBarOverrides = mergeOverrides(overrides.progressBar, {
    BarProgress: {
      style: { backgroundColor: getStatusBackgroundColor(status, theme) },
    },
  });

  const successCount = progress?.successCount ?? 0;
  const errorCount = progress?.errorCount ?? 0;
  const completed = successCount + errorCount;
  const total = progress?.totalEstimate ?? 0;
  const remaining = Math.max(total - completed, 0);
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
        overrides={progressBarOverrides}
      />
    );
  }

  const verb = actionType
    ? BATCH_ACTION_PROGRESS_VERB[actionType]
    : DEFAULT_BATCH_ACTION_PROGRESS_VERB;
  const iconSize = theme.sizing.scale600;
  // Failed and remaining are de-emphasized when there is nothing to report.
  const failedMuted = errorCount === 0;
  const remainingMuted = remaining === 0;

  return (
    <styled.Container>
      <ProgressBar
        value={completed}
        maxValue={total}
        size="large"
        overrides={progressBarOverrides}
      />
      <styled.Label>
        <styled.LabelText>
          {`${verb} ${completed} of ${total} workflows:`}
        </styled.LabelText>
        <styled.Stat>
          <MdCheckCircle
            size={iconSize}
            color={getStatIconColor('positive', false, theme)}
          />
          {`${successCount} succeeded`}
        </styled.Stat>
        <styled.Stat $muted={failedMuted}>
          <MdWarning
            size={iconSize}
            color={getStatIconColor('warning', failedMuted, theme)}
          />
          {`${errorCount} failed`}
        </styled.Stat>
        <styled.Stat $muted={remainingMuted}>
          <MdHourglassTop
            size={iconSize}
            color={getStatIconColor('neutral', remainingMuted, theme)}
          />
          {`${remaining} remaining`}
        </styled.Stat>
      </styled.Label>
    </styled.Container>
  );
}
