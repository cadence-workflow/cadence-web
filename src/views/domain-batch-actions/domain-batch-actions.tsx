'use client';
import { useEffect, useMemo, useState } from 'react';

import ErrorPanel from '@/components/error-panel/error-panel';
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
  BATCH_ACTION_DETAIL_REFETCH_INTERVAL,
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
  const batchActions = useMemo(
    () => data?.pages.flatMap((p) => p.batchActions ?? []) ?? [],
    [data]
  );

  // Default to the first action in the list unless a real (non-draft) action is selected
  const firstBatchActionId = batchActions[0]?.id ?? null;
  const selectedActionId = isDraftSelected
    ? firstBatchActionId
    : queryParams.batchActionId || firstBatchActionId;

  const {
    data: batchActionDetail,
    isLoading: isLoadingBatchActionDetail,
    error: batchActionDetailError,
    refetch: refetchBatchActionDetail,
  } = useDescribeBatchAction({
    domain: props.domain,
    cluster: props.cluster,
    batchActionId: selectedActionId ?? '',
    enabled: !isDraftSelected && !!selectedActionId,
    refetchInterval: (query) =>
      query.state.data?.status === 'RUNNING'
        ? BATCH_ACTION_DETAIL_REFETCH_INTERVAL
        : false,
  });

  if (isLoading) {
    return <SectionLoadingIndicator />;
  }
  // Should never happen as we have throwOnError but better for type safety
  if (!data) {
    throw new Error('Batch actions failed to load');
  }

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
        {!isDraftSelected &&
          selectedActionId &&
          (batchActionDetailError && !batchActionDetail ? (
            <ErrorPanel
              error={batchActionDetailError}
              message="Failed to load batch action details"
              actions={[
                {
                  kind: 'callback',
                  label: 'Retry',
                  onClick: () => refetchBatchActionDetail(),
                },
              ]}
            />
          ) : (
            (isLoadingBatchActionDetail || batchActionDetail) && (
              <DomainBatchActionDetail
                batchAction={batchActionDetail}
                loading={isLoadingBatchActionDetail}
              />
            )
          ))}
      </styled.DetailPanel>
    </styled.Container>
  );
}
