'use client';
import React, { useState } from 'react';

import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';

import BatchActionDetail from './batch-action-detail/batch-action-detail';
import BatchActionsSidebar from './batch-actions-sidebar/batch-actions-sidebar';
import { MOCK_BATCH_ACTIONS } from './domain-batch-actions.constants';
import { styled } from './domain-batch-actions.styles';

export default function DomainBatchActions(_props: DomainPageTabContentProps) {
  const [selectedId, setSelectedId] = useState<number | null>(
    MOCK_BATCH_ACTIONS[0]?.id ?? null
  );

  const selectedAction = MOCK_BATCH_ACTIONS.find(
    (action) => action.id === selectedId
  );

  return (
    <styled.Container>
      <styled.Sidebar>
        <BatchActionsSidebar
          batchActions={MOCK_BATCH_ACTIONS}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </styled.Sidebar>
      <styled.DetailPanel>
        {selectedAction && <BatchActionDetail batchAction={selectedAction} />}
      </styled.DetailPanel>
    </styled.Container>
  );
}
