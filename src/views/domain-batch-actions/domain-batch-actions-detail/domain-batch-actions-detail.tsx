'use client';
import React from 'react';

import { Skeleton } from 'baseui/skeleton';
import { MdCancel } from 'react-icons/md';

import Button from '@/components/button/button';

import DomainBatchActionHeaderInfo from '../domain-batch-actions-header-info/domain-batch-actions-header-info';
import DomainBatchActionsProgressBar from '../domain-batch-actions-progress-bar/domain-batch-actions-progress-bar';
import useTerminateBatchAction from '../hooks/use-terminate-batch-action';

import { overrides, styled } from './domain-batch-actions-detail.styles';
import { type Props } from './domain-batch-actions-detail.types';

export default function DomainBatchActionDetail({
  domain,
  cluster,
  workflowId,
  batchAction,
  loading = false,
}: Props) {
  const status = batchAction?.status;

  const { terminate, isTerminating } = useTerminateBatchAction({
    cluster,
    workflowId,
  });

  return (
    <styled.Container>
      <styled.Header>
        {batchAction ? (
          <styled.Title>Batch action #{batchAction.runId}</styled.Title>
        ) : (
          <Skeleton overrides={overrides.titleSkeleton} animation={true} />
        )}
        {batchAction?.status === 'RUNNING' && (
          <Button
            kind="primary"
            size="compact"
            overrides={overrides.abortButton}
            startEnhancer={<MdCancel />}
            isLoading={isTerminating}
            onClick={() => terminate(batchAction.runId)}
          >
            Abort batch action
          </Button>
        )}
      </styled.Header>
      <div>
        <DomainBatchActionHeaderInfo
          batchAction={batchAction}
          loading={loading}
          domain={domain}
          cluster={cluster}
          workflowId={workflowId}
        />
      </div>
      <styled.ProgressSection>
        {status && (
          <DomainBatchActionsProgressBar
            status={status}
            progress={batchAction?.progress}
            actionType={batchAction?.actionType}
          />
        )}
      </styled.ProgressSection>
    </styled.Container>
  );
}
