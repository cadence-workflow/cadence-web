'use client';
import React, { useEffect, useState } from 'react';

import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';
import useListBatchActions from '@/views/shared/hooks/use-list-batch-actions/use-list-batch-actions';

import DomainBatchActionDetail from './domain-batch-actions-detail/domain-batch-actions-detail';
import DomainBatchActionsNewActionDetail from './domain-batch-actions-new-action-detail/domain-batch-actions-new-action-detail';
import DomainBatchActionsNoActionsPlaceholder from './domain-batch-actions-no-actions-placeholder/domain-batch-actions-no-actions-placeholder';
import DomainBatchActionsSidebar from './domain-batch-actions-sidebar/domain-batch-actions-sidebar';
import {
  BATCH_ACTIONS_PAGE_SIZE,
  DRAFT_ACTION_ID,
} from './domain-batch-actions.constants';
import { styled } from './domain-batch-actions.styles';

export default function DomainBatchActions(props: DomainPageTabContentProps) {
  const [queryParams, setQueryParams] = usePageQueryParams(
    domainPageQueryParamsConfig
  );

  const { data } = useListBatchActions({
    domain: props.domain,
    cluster: props.cluster,
    pageSize: BATCH_ACTIONS_PAGE_SIZE,
  });
  const batchActions = data?.pages[0]?.batchActions ?? [];
  const isLoaded = data !== undefined;

  const isDraftSelected = queryParams.batchActionId === DRAFT_ACTION_ID;
  const selectedActionId =
    !isDraftSelected && queryParams.batchActionId
      ? queryParams.batchActionId
      : batchActions[0]?.id ?? null;

  // Keep the draft entry visible in the sidebar even after the user navigates
  // to another action, until they explicitly discard it.
  const [isDraftOpen, setIsDraftOpen] = useState(isDraftSelected);

  // Sync sidebar draft visibility when URL changes to draft (e.g. back/forward)
  useEffect(() => {
    if (isDraftSelected) {
      setIsDraftOpen(true);
    }
  }, [isDraftSelected]);

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

  if (isLoaded && batchActions.length === 0 && !isDraftOpen) {
    return (
      <styled.Container>
        <styled.DetailPanel>
          <DomainBatchActionsNoActionsPlaceholder
            onCreateNew={handleCreateNew}
          />
        </styled.DetailPanel>
      </styled.Container>
    );
  }

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
          <DomainBatchActionDetail
            // TODO: enrich with a describe-workflow call in a follow-up PR.
            // The list endpoint only surfaces id + status; the rest are
            // placeholders so the existing detail UI keeps rendering.
            batchAction={{ ...selectedAction, actionType: 'cancel' }}
          />
        )}
      </styled.DetailPanel>
    </styled.Container>
  );
}
