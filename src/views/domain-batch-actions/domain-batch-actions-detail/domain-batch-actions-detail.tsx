'use client';
import React from 'react';

import { ProgressBar } from 'baseui/progress-bar';
import { Skeleton } from 'baseui/skeleton';
import { MdCancel } from 'react-icons/md';

import Button from '@/components/button/button';

import DomainBatchActionHeaderInfo from '../domain-batch-actions-header-info/domain-batch-actions-header-info';

import {
  overrides,
  getProgressBarOverrides,
  styled,
} from './domain-batch-actions-detail.styles';
import { type Props } from './domain-batch-actions-detail.types';

export default function DomainBatchActionDetail({
  batchAction,
  loading = false,
}: Props) {
  const progress = batchAction?.progress;
  const status = batchAction?.status;
  const completed = progress ? progress.successCount + progress.errorCount : 0;
  const total = progress?.totalEstimate ?? 0;
  const hasProgress = total > 0;
  // Determinate bar once counts exist (running, completed, or failed with a last
  // known heartbeat); an indeterminate bar while a running batch has not reported
  // progress yet. Nothing otherwise.
  const showProgressBar =
    status === 'RUNNING' ||
    ((status === 'COMPLETED' || status === 'FAILED') && hasProgress);

  return (
    <styled.Container>
      <styled.Header>
        {batchAction ? (
          <styled.Title>Batch action #{batchAction.id}</styled.Title>
        ) : (
          <Skeleton overrides={overrides.titleSkeleton} animation={true} />
        )}
        {batchAction?.status === 'RUNNING' && (
          <Button
            kind="primary"
            size="compact"
            overrides={overrides.abortButton}
            startEnhancer={<MdCancel />}
          >
            Abort batch action
          </Button>
        )}
      </styled.Header>
      <div>
        <DomainBatchActionHeaderInfo
          batchAction={batchAction}
          loading={loading}
        />
      </div>
      <styled.ProgressSection>
        {showProgressBar &&
          status &&
          (hasProgress ? (
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
          ) : (
            <ProgressBar
              infinite
              showLabel
              getProgressLabel={() => 'Calculating progress…'}
              overrides={getProgressBarOverrides(status)}
            />
          ))}
      </styled.ProgressSection>
    </styled.Container>
  );
}
