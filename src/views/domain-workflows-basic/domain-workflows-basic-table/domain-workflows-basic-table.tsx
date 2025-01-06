'use client';
import React from 'react';

import ErrorPanel from '@/components/error-panel/error-panel';
import PanelSection from '@/components/panel-section/panel-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import WorkflowsTable from '@/views/shared/workflows-table/workflows-table';

import useListWorkflowsBasic from '../hooks/use-list-workflows-basic';

import { type Props } from './domain-workflows-basic-table.types';
import getWorkflowsBasicErrorPanelProps from './helpers/get-workflows-basic-error-panel-props';

export default function DomainWorkflowsBasicTable({ domain, cluster }: Props) {
  const [queryParams] = usePageQueryParams(domainPageQueryParamsConfig);

  const [
    {
      data,
      isLoading,
      status,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      error,
      refetch,
    },
  ] = useListWorkflowsBasic({ domain, cluster });

  if (isLoading) {
    return <SectionLoadingIndicator />;
  }

  if (data.length === 0) {
    const errorPanelProps = getWorkflowsBasicErrorPanelProps({
      error,
      areSearchParamsAbsent:
        !queryParams.workflowId &&
        !queryParams.workflowType &&
        !queryParams.statusBasic &&
        !queryParams.timeRangeStart &&
        !queryParams.timeRangeEnd,
    });

    if (errorPanelProps) {
      return (
        <PanelSection>
          <ErrorPanel {...errorPanelProps} reset={refetch} />
        </PanelSection>
      );
    }
  }

  return (
    <WorkflowsTable
      workflows={data}
      isLoading={isLoading}
      error={
        status === 'error' ? new Error('One or more queries failed') : null
      }
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
}
