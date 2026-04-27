'use client';
import React, { useState } from 'react';

import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';

import DomainBatchActionDetail from './domain-batch-actions-detail/domain-batch-actions-detail';
import DomainBatchActionsNewActionDetail from './domain-batch-actions-new-action-detail/domain-batch-actions-new-action-detail';
import DomainBatchActionsSidebar from './domain-batch-actions-sidebar/domain-batch-actions-sidebar';
import { MOCK_BATCH_ACTIONS } from './domain-batch-actions.constants';
import { styled } from './domain-batch-actions.styles';

export default function DomainBatchActions(_props: DomainPageTabContentProps) {
  // TODO: replace with useSuspenseQuery once the batch-actions list endpoint exists
  const batchActions = MOCK_BATCH_ACTIONS;

  // TODO: lift selectedActionId into a query param to support deep linking.
  const [selectedActionId, setSelectedActionId] = useState<string | null>(
    batchActions[0]?.id ?? null
  );
  const [isDraftOpen, setIsDraftOpen] = useState(false);
  const [isDraftSelected, setIsDraftSelected] = useState(false);

  const selectedAction = batchActions.find((a) => a.id === selectedActionId);

  const handleCreateNew = () => {
    setIsDraftOpen(true);
    setIsDraftSelected(true);
  };

  const handleSelectAction = (id: string) => {
    setSelectedActionId(id);
    setIsDraftSelected(false);
  };

  const handleSelectDraft = () => {
    setIsDraftSelected(true);
  };

  const handleDiscard = () => {
    setIsDraftOpen(false);
    setIsDraftSelected(false);
  };

  return (
    <styled.Container>
      <styled.Sidebar>
        <DomainBatchActionsSidebar
          batchActions={batchActions}
          isDraftOpen={isDraftOpen}
          isDraftSelected={isDraftSelected}
          selectedActionId={selectedActionId}
          onSelectAction={handleSelectAction}
          onSelectDraft={handleSelectDraft}
          onCreateNew={handleCreateNew}
        />
      </styled.Sidebar>
      <styled.DetailPanel>
        {isDraftSelected && (
          <DomainBatchActionsNewActionDetail onDiscard={handleDiscard} />
        )}
        {!isDraftSelected && selectedAction && (
          <DomainBatchActionDetail batchAction={selectedAction} />
        )}
      </styled.DetailPanel>
    </styled.Container>
  );
}
