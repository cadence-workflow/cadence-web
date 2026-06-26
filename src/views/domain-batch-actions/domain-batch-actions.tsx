'use client';
import { useEffect, useMemo, useState } from 'react';

import { Banner, HIERARCHY, KIND } from 'baseui/banner';
import { notFound } from 'next/navigation';
import { MdErrorOutline } from 'react-icons/md';

import ErrorPanel from '@/components/error-panel/error-panel';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import useConfigValue from '@/hooks/use-config-value/use-config-value';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import { type BatchActionListItem } from '@/route-handlers/list-batch-actions/list-batch-actions.types';
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
  BATCH_DRAFT_RESET_PARAMS,
  DRAFT_ACTION_ID,
} from './domain-batch-actions.constants';
import { styled } from './domain-batch-actions.styles';
import resolveSelectedBatchAction from './helpers/resolve-selected-batch-action';

export default function DomainBatchActions(props: DomainPageTabContentProps) {
  const { data: isBatchActionsEnabled, isLoading: isConfigLoading } =
    useConfigValue('BATCH_ACTIONS_UI_ENABLED', {
      domain: props.domain,
      cluster: props.cluster,
    });

  if (isConfigLoading) {
    return <SectionLoadingIndicator />;
  }

  if (!isBatchActionsEnabled) {
    return notFound();
  }

  return <DomainBatchActionsContent {...props} />;
}

function DomainBatchActionsContent(props: DomainPageTabContentProps) {
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

  const { selectedActionId, selectedWorkflowId } = resolveSelectedBatchAction({
    batchActions,
    batchActionId: queryParams.batchActionId,
    batchActionWorkflowId: queryParams.batchActionWorkflowId,
  });

  const {
    data: batchActionDetail,
    isLoading: isLoadingBatchActionDetail,
    error: batchActionDetailError,
    refetch: refetchBatchActionDetail,
  } = useDescribeBatchAction({
    domain: props.domain,
    cluster: props.cluster,
    workflowId: selectedWorkflowId ?? '',
    runId: selectedActionId ?? '',
    enabled: !isDraftSelected && !!selectedActionId && !!selectedWorkflowId,
    refetchInterval: (query) =>
      query.state.data?.status === 'RUNNING'
        ? BATCH_ACTION_DETAIL_REFETCH_INTERVAL
        : false,
  });

  // The URL carries only one of the two required ids, so no action could be
  // resolved (see resolveSelectedBatchAction).
  const isInvalidSelection =
    !isDraftSelected &&
    !selectedActionId &&
    (Boolean(queryParams.batchActionId) ||
      Boolean(queryParams.batchActionWorkflowId));

  // The selection can't be shown: it's an invalid URL pair, or describe
  // reported the action isn't a batch action / doesn't exist.
  const isSelectedActionNotFound =
    !isDraftSelected &&
    (isInvalidSelection ||
      (!!selectedActionId && batchActionDetailError?.status === 404));

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
      ...BATCH_DRAFT_RESET_PARAMS,
      batchActionId: DRAFT_ACTION_ID,
      batchQuery: BATCH_ACTION_DEFAULT_QUERY,
    });
  };

  const handleSelectAction = (action: BatchActionListItem) => {
    setQueryParams({
      batchActionId: action.runId,
      batchActionWorkflowId: action.workflowId,
    });
  };

  const handleClearSelectedAction = () => {
    setQueryParams({
      batchActionId: undefined,
      batchActionWorkflowId: undefined,
    });
  };

  const handleSelectDraft = () => {
    setQueryParams({ batchActionId: DRAFT_ACTION_ID });
  };

  const handleDiscard = () => {
    setIsDraftOpen(false);
    setQueryParams(BATCH_DRAFT_RESET_PARAMS);
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
          (selectedActionId || isInvalidSelection) &&
          (isSelectedActionNotFound ? (
            <ErrorPanel
              message="Batch action not found"
              description="This batch action does not exist or is no longer available."
              actions={[
                {
                  kind: 'callback',
                  label: 'View batch actions',
                  onClick: handleClearSelectedAction,
                },
              ]}
            />
          ) : batchActionDetailError && !batchActionDetail ? (
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
              <>
                {batchActionDetailError && batchActionDetail && (
                  <Banner
                    hierarchy={HIERARCHY.low}
                    kind={KIND.warning}
                    artwork={{ icon: MdErrorOutline }}
                    action={{
                      label: 'Retry',
                      onClick: () => refetchBatchActionDetail(),
                    }}
                  >
                    Showing last known data. Could not refresh batch action
                    details.
                  </Banner>
                )}
                {batchActionDetail?.progressError && (
                  <Banner
                    hierarchy={HIERARCHY.low}
                    kind={KIND.warning}
                    artwork={{ icon: MdErrorOutline }}
                  >
                    Could not load batch action progress.
                  </Banner>
                )}
                <DomainBatchActionDetail
                  batchAction={batchActionDetail}
                  loading={isLoadingBatchActionDetail}
                />
              </>
            )
          ))}
      </styled.DetailPanel>
    </styled.Container>
  );
}
