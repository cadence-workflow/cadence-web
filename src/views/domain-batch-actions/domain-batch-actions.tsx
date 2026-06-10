'use client';
import { useEffect, useRef, useState } from 'react';

import { useSnackbar } from 'baseui/snackbar';
import { MdErrorOutline } from 'react-icons/md';

import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';
import useDescribeBatchAction from '@/views/shared/hooks/use-describe-batch-action/use-describe-batch-action';
import useListBatchActions from '@/views/shared/hooks/use-list-batch-actions/use-list-batch-actions';

import DomainBatchActionDetail from './domain-batch-actions-detail/domain-batch-actions-detail';
import DomainBatchActionsNewActionDetail from './domain-batch-actions-new-action-detail/domain-batch-actions-new-action-detail';
import DomainBatchActionsNoActionsPlaceholder from './domain-batch-actions-no-actions-placeholder/domain-batch-actions-no-actions-placeholder';
import DomainBatchActionsSidebar from './domain-batch-actions-sidebar/domain-batch-actions-sidebar';
import {
  BATCH_ACTIONS_PAGE_SIZE,
  BATCH_ACTION_DEFAULT_QUERY,
  DRAFT_ACTION_ID,
} from './domain-batch-actions.constants';
import { styled } from './domain-batch-actions.styles';

export default function DomainBatchActions(props: DomainPageTabContentProps) {
  const [queryParams, setQueryParams] = usePageQueryParams(
    domainPageQueryParamsConfig
  );

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useListBatchActions({
    domain: props.domain,
    cluster: props.cluster,
    pageSize: BATCH_ACTIONS_PAGE_SIZE,
    // Throw only when the initial load fails (no data yet) so the route-level
    // error boundary renders the tab error. Next-page failures keep the
    // sidebar visible and are surfaced inline by TableInfiniteScrollLoader.
    throwOnError: (_err, query) => query.state.data === undefined,
  });

  const isDraftSelected = queryParams.batchActionId === DRAFT_ACTION_ID;

  // Keep the draft entry visible in the sidebar even after the user navigates
  // to another action, until they explicitly discard it.
  const [isDraftOpen, setIsDraftOpen] = useState(isDraftSelected);

  // Sync sidebar draft visibility when URL changes to draft (e.g. back/forward)
  useEffect(() => {
    if (isDraftSelected) {
      setIsDraftOpen(true);
    }
  }, [isDraftSelected]);

  // Computed defensively (data may be undefined while loading) so the hooks
  // below are always called unconditionally, before any early return.
  const batchActions = data?.pages.flatMap((p) => p.batchActions ?? []) ?? [];

  const selectedActionId =
    !isDraftSelected && queryParams.batchActionId
      ? queryParams.batchActionId
      : batchActions[0]?.id ?? null;

  const {
    data: batchActionDetail,
    isLoading: isLoadingBatchActionDetail,
    error: batchActionDetailError,
  } = useDescribeBatchAction({
    domain: props.domain,
    cluster: props.cluster,
    batchActionId: selectedActionId ?? '',
    enabled: !isDraftSelected && !!selectedActionId,
  });

  const { enqueue, dequeue } = useSnackbar();
  const lastShownErrorRef = useRef<string | null>(null);
  useEffect(() => {
    if (!batchActionDetailError) {
      lastShownErrorRef.current = null;
      return;
    }
    const message =
      batchActionDetailError.message || 'Failed to fetch batch action details';
    if (lastShownErrorRef.current === message) return;
    lastShownErrorRef.current = message;
    enqueue({
      message,
      startEnhancer: MdErrorOutline,
      actionMessage: 'OK',
      actionOnClick: () => dequeue(),
    });
  }, [batchActionDetailError, enqueue, dequeue]);

  if (isLoading) {
    return <SectionLoadingIndicator />;
  }
  // Should never happen as we have throwOnError but better for type safety
  if (!data) {
    throw new Error('Batch actions failed to load');
  }

  const selectedAction = batchActions.find((a) => a.id === selectedActionId);

  const handleCreateNew = () => {
    setIsDraftOpen(true);
    setQueryParams({
      batchActionId: DRAFT_ACTION_ID,
      batchQuery: BATCH_ACTION_DEFAULT_QUERY,
    });
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

  if (batchActions.length === 0 && !isDraftOpen) {
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
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          error={error}
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
            batchAction={batchActionDetail ?? selectedAction}
            loading={isLoadingBatchActionDetail}
          />
        )}
      </styled.DetailPanel>
    </styled.Container>
  );
}
