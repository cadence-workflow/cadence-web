'use client';
import React from 'react';

import ErrorPanel from '@/components/error-panel/error-panel';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import Table from '@/components/table/table';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';

import domainWorkflowsBasicTableConfig from '../config/domain-workflows-basic-table.config';
import useListWorkflowsBasic from '../hooks/use-list-workflows-basic';

import { styled } from './domain-workflows-basic-table.styles';
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
        <styled.ErrorPanelContainer>
          <ErrorPanel {...errorPanelProps} reset={refetch} />
        </styled.ErrorPanelContainer>
      );
    }
  }

  return (
    <styled.TableContainer>
      <Table
        data={data}
        columns={domainWorkflowsBasicTableConfig}
        shouldShowResults={!isLoading && data.length > 0}
        endMessageProps={{
          kind: 'infinite-scroll',
          hasData: data.length > 0,
          error:
            status === 'error' ? new Error('One or more queries failed') : null,
          fetchNextPage,
          hasNextPage,
          isFetchingNextPage,
        }}
      />
    </styled.TableContainer>
  );
}
