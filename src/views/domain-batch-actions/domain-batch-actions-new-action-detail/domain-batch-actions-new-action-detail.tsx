'use client';
import React, { useCallback } from 'react';

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

import domainBatchActionsNewActionFloatingBarConfig from '../config/domain-batch-actions-new-action-floating-bar.config';
import DomainBatchActionsNewActionFloatingBar from '../domain-batch-actions-new-action-floating-bar/domain-batch-actions-new-action-floating-bar';
import DomainBatchActionsNewActionInfoBanner from '../domain-batch-actions-new-action-info-banner/domain-batch-actions-new-action-info-banner';
import DomainBatchActionsNewActionParams from '../domain-batch-actions-new-action-params/domain-batch-actions-new-action-params';
import batchActionParamsSchema from '../domain-batch-actions-new-action-params/schemas/batch-action-params-schema';
import { BATCH_ACTION_RPS_DEFAULT } from '../domain-batch-actions.constants';

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
    formState: { errors, isValid, isSubmitted },
  } = useForm({
    resolver: zodResolver(batchActionParamsSchema),
    defaultValues: { description: '', rps: BATCH_ACTION_RPS_DEFAULT },
    mode: 'onChange',
  });

  const hasValidationErrors = isSubmitted && !isValid;

  const handleActionClick = useCallback(
    (_actionId: string) => {
      handleSubmit(() => {
        // TODO: handle action execution
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
  } = useCountWorkflows({
    domain,
    cluster,
    query: queryParams.batchQuery,
  });

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
        fieldErrors={isSubmitted ? errors : {}}
      />
      <WorkflowsHeader
        pageQueryParamsConfig={domainPageQueryParamsConfig}
        pageFiltersConfig={domainWorkflowsFiltersConfig}
        inputTypeQueryParamKey="batchInputType"
        searchQueryParamKey="search"
        queryStringQueryParamKey="batchQuery"
        refetchQuery={refetch}
        isQueryRunning={isFetching}
        showQueryInputOnly
        noSpacing
      />
      {isDataLoading && <SectionLoadingIndicator />}
      {!isDataLoading && errorPanelProps && (
        <PanelSection>
          <ErrorPanel {...errorPanelProps} reset={refetch} />
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
    </styled.Container>
  );
}
