'use client';
import React, { useState } from 'react';

import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';

import DomainBatchActionDetail from './domain-batch-action-detail/domain-batch-action-detail';
import DomainBatchActionsSidebar from './domain-batch-actions-sidebar/domain-batch-actions-sidebar';
import { MOCK_BATCH_ACTIONS } from './domain-batch-actions.constants';
import { styled } from './domain-batch-actions.styles';
import { type SelectedId } from './domain-batch-actions.types';
import NewBatchActionDetail from './new-batch-action-detail/new-batch-action-detail';

export default function DomainBatchActions(_props: DomainPageTabContentProps) {
  // TODO: replace with useSuspenseQuery once the batch-actions list endpoint exists
  const batchActions = MOCK_BATCH_ACTIONS;

  const [hasDraft, setHasDraft] = useState(false);
  const [selectedId, setSelectedId] = useState<SelectedId>(
    batchActions[0]?.id ?? null
  );

  const selectedAction =
    typeof selectedId === 'number'
      ? batchActions.find((action) => action.id === selectedId)
      : undefined;

  const handleCreateNew = () => {
    setHasDraft(true);
    setSelectedId('draft');
  };

  const handleDiscard = () => {
    setHasDraft(false);
    setSelectedId(batchActions[0]?.id ?? null);
  };

  return (
    <styled.Container>
      <styled.Sidebar>
        <DomainBatchActionsSidebar
          batchActions={batchActions}
          hasDraft={hasDraft}
          selectedId={selectedId}
          onSelect={(next) => setSelectedId(next)}
          onCreateNew={handleCreateNew}
        />
      </styled.Sidebar>
      <styled.DetailPanel>
        {selectedId === 'draft' && (
          <NewBatchActionDetail onDiscard={handleDiscard} />
        )}
        {selectedAction && (
          <DomainBatchActionDetail batchAction={selectedAction} />
        )}
      </styled.DetailPanel>
    </styled.Container>
  );
}
