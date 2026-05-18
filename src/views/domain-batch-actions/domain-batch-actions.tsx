'use client';
import React, { useState } from 'react';

import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';

import DomainBatchActionDetail from './domain-batch-actions-detail/domain-batch-actions-detail';
import DomainBatchActionsNewActionDetail from './domain-batch-actions-new-action-detail/domain-batch-actions-new-action-detail';
import DomainBatchActionsSidebar from './domain-batch-actions-sidebar/domain-batch-actions-sidebar';
import { DRAFT_ACTION_ID, MOCK_BATCH_ACTIONS } from './domain-batch-actions.constants';
import { styled } from './domain-batch-actions.styles';

export default function DomainBatchActions(props: DomainPageTabContentProps) {
  const [queryParams, setQueryParams] = usePageQueryParams(
    domainPageQueryParamsConfig
  );

  // TODO: replace with useSuspenseQuery once the batch-actions list endpoint exists
  const batchActions = MOCK_BATCH_ACTIONS;

  const isDraftSelected =
    queryParams.batchActionId === DRAFT_ACTION_ID ||
    (!queryParams.batchActionId && Boolean(queryParams.batchQuery));
  const selectedActionId =
    !isDraftSelected && queryParams.batchActionId
      ? queryParams.batchActionId
      : (batchActions[0]?.id ?? null);

  const [isDraftOpen, setIsDraftOpen] = useState(
    isDraftSelected || Boolean(queryParams.batchQuery)
  );

  const selectedAction = batchActions.find((a) => a.id === selectedActionId);

  const handleCreateNew = () => {
    setIsDraftOpen(true);
    setQueryParams({ batchActionId: DRAFT_ACTION_ID });
  };

  const handleSelectAction = (id: string) => {
    setQueryParams({ batchActionId: id });
  };

  const handleSelectDraft = () => {
    setQueryParams({ batchActionId: DRAFT_ACTION_ID });
  };

  const handleDiscard = () => {
    setIsDraftOpen(false);
    setQueryParams({ batchActionId: undefined, batchQuery: '' });
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
          <DomainBatchActionsNewActionDetail
            domain={props.domain}
            cluster={props.cluster}
            onDiscard={handleDiscard}
          />
        )}
        {!isDraftSelected && selectedAction && (
          <DomainBatchActionDetail batchAction={selectedAction} />
        )}
      </styled.DetailPanel>
    </styled.Container>
  );
}
