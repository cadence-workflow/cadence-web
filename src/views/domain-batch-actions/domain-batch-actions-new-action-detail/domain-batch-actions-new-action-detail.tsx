'use client';
import React, { useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { MdDeleteOutline } from 'react-icons/md';

import Button from '@/components/button/button';
import ErrorPanel from '@/components/error-panel/error-panel';
import PanelSection from '@/components/panel-section/panel-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import domainWorkflowsFiltersConfig from '@/views/domain-workflows/config/domain-workflows-filters.config';
import DOMAIN_WORKFLOWS_PAGE_SIZE from '@/views/domain-workflows/config/domain-workflows-page-size.config';
import getWorkflowsErrorPanelProps from '@/views/domain-workflows/domain-workflows-table/helpers/get-workflows-error-panel-props';
import useCountWorkflows from '@/views/shared/hooks/use-count-workflows';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows';
import WorkflowsHeader from '@/views/shared/workflows-header/workflows-header';
import useWorkflowsListColumns from '@/views/shared/workflows-list/hooks/use-workflows-list-columns';
import WorkflowsList from '@/views/shared/workflows-list/workflows-list';

import domainBatchActionsConfirmationModalConfig from '../config/domain-batch-actions-confirmation-modal.config';
import domainBatchActionsNewActionFloatingBarConfig from '../config/domain-batch-actions-new-action-floating-bar.config';
import DomainBatchActionsConfirmationModal from '../domain-batch-actions-confirmation-modal/domain-batch-actions-confirmation-modal';
import DomainBatchActionsNewActionFloatingBar from '../domain-batch-actions-new-action-floating-bar/domain-batch-actions-new-action-floating-bar';
import DomainBatchActionsNewActionInfoBanner from '../domain-batch-actions-new-action-info-banner/domain-batch-actions-new-action-info-banner';
import DomainBatchActionsNewActionParams from '../domain-batch-actions-new-action-params/domain-batch-actions-new-action-params';
import batchActionParamsSchema from '../domain-batch-actions-new-action-params/schemas/batch-action-params-schema';
import { BATCH_ACTION_RPS_DEFAULT } from '../domain-batch-actions.constants';
import { type BatchActionConfirmableType } from '../domain-batch-actions.types';
import useConfirmBatchAction from '../hooks/use-confirm-batch-action';

import {
  overrides,
  styled,
} from './domain-batch-actions-new-action-detail.styles';
import { type Props } from './domain-batch-actions-new-action-detail.types';

export default function DomainBatchActionsNewActionDetail({
  domain,
  cluster,
  onDiscard,
}: Props) {
  const [queryParams] = usePageQueryParams(domainPageQueryParamsConfig);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid, isSubmitted },
  } = useForm({
    resolver: zodResolver(batchActionParamsSchema),
    defaultValues: { description: '', rps: BATCH_ACTION_RPS_DEFAULT },
  });

  const [activeAction, setActiveAction] =
    useState<BatchActionConfirmableType | null>(null);
  const hasValidationErrors = isSubmitted && !isValid;

  const { handleConfirm, isPending: isStartingBatchAction } =
    useConfirmBatchAction({
      domain,
      cluster,
      onSuccess: () => setActiveAction(null),
    });

  const handleActionClick = useCallback(
    (actionId: string) => {
      handleSubmit(() => {
        if (!(actionId in domainBatchActionsConfirmationModalConfig)) return;
        setActiveAction(actionId as BatchActionConfirmableType);
      })();
    },
    [handleSubmit]
  );

  // Reuse the workflows tab's column selection (persisted per-domain in
  // localStorage) so the user sees the same search attributes they picked
  // there.
  const { visibleColumns } = useWorkflowsListColumns({ cluster, domain });

  const {
    workflows,
    error,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useListWorkflows({
    domain,
    cluster,
    listType: 'default',
    pageSize: DOMAIN_WORKFLOWS_PAGE_SIZE,
    inputType: 'query',
    query: queryParams.batchQuery,
  });

  const {
    count: totalWorkflowCount,
    error: countError,
    isLoading: isCountLoading,
    refetch: refetchCount,
  } = useCountWorkflows({
    domain,
    cluster,
    query: queryParams.batchQuery,
  });

  const refetchAll = useCallback(() => {
    refetch();
    refetchCount();
  }, [refetch, refetchCount]);

  const isDataLoading = isLoading || isCountLoading;

  const errorPanelProps =
    workflows.length === 0 || countError
      ? getWorkflowsErrorPanelProps({
          inputType: 'query',
          error: error ?? countError,
          // TODO: compute this from the panel's filter state, the way
          // domain-workflows-table.tsx does. Hardcoded false for now because
          // batchQuery is the only filter and an empty query is a valid state.
          areSearchParamsAbsent: false,
        })
      : undefined;
  return (
    <styled.Container>
      <styled.Header>
        <styled.Title>New batch action</styled.Title>
        <Button
          kind="secondary"
          size="compact"
          overrides={overrides.discardButton}
          startEnhancer={<MdDeleteOutline />}
          onClick={onDiscard}
        >
          Discard batch action
        </Button>
      </styled.Header>
      <DomainBatchActionsNewActionInfoBanner />
      <DomainBatchActionsNewActionParams
        control={control}
        fieldErrors={errors}
      />
      <WorkflowsHeader
        pageQueryParamsConfig={domainPageQueryParamsConfig}
        pageFiltersConfig={domainWorkflowsFiltersConfig}
        inputTypeQueryParamKey="batchInputType"
        searchQueryParamKey="search"
        queryStringQueryParamKey="batchQuery"
        refetchQuery={refetchAll}
        isQueryRunning={isFetching}
        showQueryInputOnly
        noSpacing
      />
      {isDataLoading && <SectionLoadingIndicator />}
      {!isDataLoading && errorPanelProps && (
        <PanelSection>
          <ErrorPanel {...errorPanelProps} reset={refetchAll} />
        </PanelSection>
      )}
      {!isDataLoading && !errorPanelProps && (
        <WorkflowsList
          workflows={workflows}
          columns={visibleColumns}
          error={error}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
      {!isDataLoading && !errorPanelProps && !!totalWorkflowCount && (
        <styled.FloatingBarSlot>
          <DomainBatchActionsNewActionFloatingBar
            selectedCount={totalWorkflowCount}
            totalCount={totalWorkflowCount}
            actions={domainBatchActionsNewActionFloatingBarConfig}
            onActionClick={handleActionClick}
            disabled={hasValidationErrors}
          />
        </styled.FloatingBarSlot>
      )}
      <DomainBatchActionsConfirmationModal
        actionId={activeAction}
        selectedCount={totalWorkflowCount ?? 0}
        isSubmitting={isStartingBatchAction}
        onClose={() => setActiveAction(null)}
        onConfirm={(payload) =>
          handleConfirm({
            batchType: payload.actionId,
            // TODO: queryParams.batchQuery is empty until the user clicks
            // "Run Query" — typing alone doesn't commit. The batcher rejects
            // an empty Query, so this needs gating before submit. (CDNC-19042)
            query: queryParams.batchQuery ?? '',
            reason: getValues('description'),
            rps: getValues('rps'),
            signalParams:
              payload.actionId === 'signal'
                ? payload.submissionData
                : undefined,
          })
        }
      />
    </styled.Container>
  );
}
