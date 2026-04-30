'use client';
import React, { useEffect } from 'react';

import { MdDeleteOutline } from 'react-icons/md';

import Button from '@/components/button/button';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import DOMAIN_WORKFLOWS_PAGE_SIZE from '@/views/domain-workflows/config/domain-workflows-page-size.config';
import DomainWorkflowsHeader from '@/views/domain-workflows/domain-workflows-header/domain-workflows-header';
import DomainWorkflowsList from '@/views/domain-workflows/domain-workflows-list/domain-workflows-list';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows';
import useWorkflowsListColumns from '@/views/shared/workflows-list/hooks/use-workflows-list-columns';

import domainBatchActionsNewActionFloatingBarConfig from '../config/domain-batch-actions-new-action-floating-bar.config';
import DomainBatchActionsNewActionFloatingBar from '../domain-batch-actions-new-action-floating-bar/domain-batch-actions-new-action-floating-bar';
import DomainBatchActionsNewActionInfoBanner from '../domain-batch-actions-new-action-info-banner/domain-batch-actions-new-action-info-banner';

import {
  overrides,
  styled,
} from './domain-batch-actions-new-action-detail.styles';
import { type Props } from './domain-batch-actions-new-action-detail.types';
import getBatchActionsVisibleColumns from './helpers/get-batch-actions-visible-columns';

export default function DomainBatchActionsNewActionDetail({
  domain,
  cluster,
  onDiscard,
}: Props) {
  const [queryParams, setQueryParams] = usePageQueryParams(
    domainPageQueryParamsConfig
  );

  // Seed batchQuery from the workflows tab's `query` param on first mount so
  // a user opening the draft after running a query in the workflows tab does
  // not have to retype it. After this, batchQuery and query evolve
  // independently — the panel never writes back to `query`.
  useEffect(() => {
    if (!queryParams.batchQuery && queryParams.query) {
      setQueryParams({ batchQuery: queryParams.query });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { availableColumns } = useWorkflowsListColumns({ cluster, domain });

  const visibleColumns = getBatchActionsVisibleColumns(availableColumns);

  const { workflows } = useListWorkflows({
    domain,
    cluster,
    listType: 'default',
    pageSize: DOMAIN_WORKFLOWS_PAGE_SIZE,
    inputType: queryParams.batchInputType,
    query: queryParams.batchQuery,
  });

  const workflowCount = workflows.length;

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
      <DomainWorkflowsHeader
        domain={domain}
        cluster={cluster}
        showQueryInputOnly
        noSpacing
        inputTypeQueryParamKey="batchInputType"
        queryStringQueryParamKey="batchQuery"
      />
      <styled.WorkflowsListContainer>
        <DomainWorkflowsList
          domain={domain}
          cluster={cluster}
          visibleColumns={visibleColumns}
          inputTypeQueryParamKey="batchInputType"
          queryStringQueryParamKey="batchQuery"
        />
        {workflowCount > 0 && (
          <styled.FloatingBarSlot>
            <DomainBatchActionsNewActionFloatingBar
              selectedCount={workflowCount}
              totalCount={workflowCount}
              actions={domainBatchActionsNewActionFloatingBarConfig}
              onActionClick={() => {}}
            />
          </styled.FloatingBarSlot>
        )}
      </styled.WorkflowsListContainer>
    </styled.Container>
  );
}
