'use client';
import React, { useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { MdDeleteOutline } from 'react-icons/md';

import Button from '@/components/button/button';
import ErrorPanel from '@/components/error-panel/error-panel';
import GuidedTourProvider from '@/components/guided-tour/guided-tour-provider/guided-tour-provider';
import PanelSection from '@/components/panel-section/panel-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import { type BatchActionType } from '@/route-handlers/describe-batch-action/describe-batch-action.types';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import getWorkflowsErrorPanelProps from '@/views/domain-workflows/domain-workflows-table/helpers/get-workflows-error-panel-props';
import WorkflowsHeader from '@/views/shared/workflows-header/workflows-header';
import useWorkflowsListColumns from '@/views/shared/workflows-list/hooks/use-workflows-list-columns';
import WorkflowsList from '@/views/shared/workflows-list/workflows-list';

import domainBatchActionsConfirmationModalConfig from '../config/domain-batch-actions-confirmation-modal.config';
import domainBatchActionsFiltersConfig from '../config/domain-batch-actions-filters.config';
import domainBatchActionsNewActionFloatingBarConfig from '../config/domain-batch-actions-new-action-floating-bar.config';
import { domainBatchActionsDraftTourConfig } from '../config/domain-batch-actions-tour.config';
import DomainBatchActionsConfirmationModal from '../domain-batch-actions-confirmation-modal/domain-batch-actions-confirmation-modal';
import DomainBatchActionsNewActionFloatingBar from '../domain-batch-actions-new-action-floating-bar/domain-batch-actions-new-action-floating-bar';
import DomainBatchActionsNewActionInfoBanner from '../domain-batch-actions-new-action-info-banner/domain-batch-actions-new-action-info-banner';
import DomainBatchActionsNewActionParams from '../domain-batch-actions-new-action-params/domain-batch-actions-new-action-params';
import batchActionParamsSchema from '../domain-batch-actions-new-action-params/schemas/batch-action-params-schema';
import { BATCH_ACTION_RPS_DEFAULT } from '../domain-batch-actions.constants';
import useBatchActionTarget from '../hooks/use-batch-action-target';
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
  const {
    workflowsQueryResult,
    countQueryResult,
    refetchAll,
    selectedCount,
    isTargetEmpty,
    blocksSubmit,
    getBatchActionQuery,
    onSubmitAttempt,
    queryHint,
    listSelection,
  } = useBatchActionTarget({ domain, cluster });

  const {
    workflows,
    error: queryError,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = workflowsQueryResult;
  const {
    count: totalWorkflowCount,
    error: countError,
    isLoading: isCountLoading,
  } = countQueryResult;

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid, isSubmitted },
  } = useForm({
    resolver: zodResolver(batchActionParamsSchema),
    defaultValues: { description: '', rps: BATCH_ACTION_RPS_DEFAULT },
  });

  const [activeAction, setActiveAction] = useState<BatchActionType | null>(
    null
  );

  const { handleConfirm, isPending: isStartingBatchAction } =
    useConfirmBatchAction({
      domain,
      cluster,
      onSuccess: () => setActiveAction(null),
    });

  // Reuse the workflows tab's column selection (persisted per-domain in
  // localStorage) so the user sees the same search attributes they picked
  // there.
  const { visibleColumns } = useWorkflowsListColumns({ cluster, domain });

  const hasValidationErrors = (isSubmitted && !isValid) || blocksSubmit;

  const handleActionClick = useCallback(
    (actionId: string) => {
      onSubmitAttempt();
      handleSubmit(() => {
        if (isTargetEmpty) return;
        if (!(actionId in domainBatchActionsConfirmationModalConfig)) return;
        setActiveAction(actionId as BatchActionType);
      })();
    },
    [handleSubmit, onSubmitAttempt, isTargetEmpty]
  );

  const isDataLoading = isQueryLoading || isCountLoading;

  const errorPanelProps =
    workflows.length === 0 || countError
      ? getWorkflowsErrorPanelProps({
          inputType: 'query',
          error: queryError ?? countError,
          areSearchParamsAbsent: false,
        })
      : undefined;
  return (
    <GuidedTourProvider
      tourId="batch-actions-draft"
      steps={domainBatchActionsDraftTourConfig}
    >
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
        <div data-tour="batch-draft-params">
          <DomainBatchActionsNewActionParams
            control={control}
            fieldErrors={errors}
          />
        </div>
        <div data-tour="batch-input-toggle">
          <WorkflowsHeader
            pageQueryParamsConfig={domainPageQueryParamsConfig}
            pageFiltersConfig={domainBatchActionsFiltersConfig}
            inputTypeQueryParamKey="batchActionInputType"
            searchQueryParamKey="batchActionSearch"
            queryStringQueryParamKey="batchActionQuery"
            searchSegmentLabel="Select"
            refetchQuery={refetchAll}
            isQueryRunning={isQueryFetching}
            noSpacing
          />
          {queryHint && (
            <styled.QueryHint $kind={queryHint.kind}>
              {queryHint.message}
            </styled.QueryHint>
          )}
        </div>
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
            error={queryError}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            selection={listSelection}
          />
        )}
        {!isDataLoading && !errorPanelProps && !!totalWorkflowCount && (
          <styled.FloatingBarSlot>
            <DomainBatchActionsNewActionFloatingBar
              selectedCount={selectedCount}
              totalCount={totalWorkflowCount}
              actions={domainBatchActionsNewActionFloatingBarConfig}
              onActionClick={handleActionClick}
              disabled={hasValidationErrors}
            />
          </styled.FloatingBarSlot>
        )}
        <DomainBatchActionsConfirmationModal
          config={domainBatchActionsConfirmationModalConfig}
          actionId={activeAction}
          selectedCount={selectedCount}
          isSubmitting={isStartingBatchAction}
          onClose={() => setActiveAction(null)}
          onConfirm={(payload) =>
            handleConfirm({
              batchType: payload.actionId,
              // An empty target is blocked before submit (required-query in query
              // mode, non-empty selection in select mode), so the query is
              // guaranteed non-empty here.
              query: getBatchActionQuery(),
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
    </GuidedTourProvider>
  );
}
