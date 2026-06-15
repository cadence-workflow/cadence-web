'use client';
import React, { useState } from 'react';

import { Skeleton } from 'baseui/skeleton';
import { MdCancel } from 'react-icons/md';

import Button from '@/components/button/button';

import DomainBatchActionsEditRpsModal from '../domain-batch-actions-edit-rps-modal/domain-batch-actions-edit-rps-modal';
import DomainBatchActionHeaderInfo from '../domain-batch-actions-header-info/domain-batch-actions-header-info';
import DomainBatchActionsProgressBar from '../domain-batch-actions-progress-bar/domain-batch-actions-progress-bar';
import useEditBatchActionRps from '../hooks/use-edit-batch-action-rps';

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
  const [isRpsModalOpen, setIsRpsModalOpen] = useState(false);

  const { editRps, isPending: isEditingRps } = useEditBatchActionRps({
    domain,
    cluster,
    workflowId,
    runId: batchAction?.runId ?? '',
    onSuccess: () => setIsRpsModalOpen(false),
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
          >
            Abort batch action
          </Button>
        )}
      </styled.Header>
      <div>
        <DomainBatchActionHeaderInfo
          batchAction={batchAction}
          loading={loading}
          onEditRps={() => setIsRpsModalOpen(true)}
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
      <DomainBatchActionsEditRpsModal
        isOpen={isRpsModalOpen}
        currentRps={batchAction?.rps}
        isSubmitting={isEditingRps}
        onClose={() => setIsRpsModalOpen(false)}
        onSubmit={editRps}
      />
    </styled.Container>
  );
}
