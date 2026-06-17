'use client';
import React from 'react';

import { Skeleton } from 'baseui/skeleton';
import { MdCancel } from 'react-icons/md';

import Button from '@/components/button/button';

import DomainBatchActionHeaderInfo from '../domain-batch-actions-header-info/domain-batch-actions-header-info';
import DomainBatchActionsProgressBar from '../domain-batch-actions-progress-bar/domain-batch-actions-progress-bar';

import { overrides, styled } from './domain-batch-actions-detail.styles';
import { type Props } from './domain-batch-actions-detail.types';

export default function DomainBatchActionDetail({
  batchAction,
  loading = false,
}: Props) {
  const status = batchAction?.status;

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
        {status && (
          <DomainBatchActionsProgressBar
            status={status}
            progress={batchAction?.progress}
          />
        )}
      </styled.ProgressSection>
    </styled.Container>
  );
}
