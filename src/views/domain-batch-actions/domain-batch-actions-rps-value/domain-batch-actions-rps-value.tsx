'use client';
import React, { useState } from 'react';

import DomainBatchActionsEditRpsModal from '../domain-batch-actions-edit-rps-modal/domain-batch-actions-edit-rps-modal';
import DomainBatchActionEditableValue from '../domain-batch-actions-editable-value/domain-batch-actions-editable-value';
import useEditBatchActionRps from '../hooks/use-edit-batch-action-rps';

import { type Props } from './domain-batch-actions-rps-value.types';

export default function DomainBatchActionRpsValue({
  domain,
  cluster,
  workflowId,
  batchAction,
}: Props) {
  const [isRpsModalOpen, setIsRpsModalOpen] = useState(false);

  const { editRps, isPending: isEditingRps } = useEditBatchActionRps({
    domain,
    cluster,
    workflowId,
    runId: batchAction.runId,
    onSuccess: () => setIsRpsModalOpen(false),
  });

  return (
    <>
      <DomainBatchActionEditableValue
        value={batchAction.rps}
        editable={batchAction.status === 'RUNNING'}
        onEdit={() => setIsRpsModalOpen(true)}
      />
      <DomainBatchActionsEditRpsModal
        isOpen={isRpsModalOpen}
        currentRps={batchAction.rps}
        isSubmitting={isEditingRps}
        onClose={() => setIsRpsModalOpen(false)}
        onSubmit={editRps}
      />
    </>
  );
}
