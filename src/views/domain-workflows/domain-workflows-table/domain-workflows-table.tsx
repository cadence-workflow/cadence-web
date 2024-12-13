'use client';
import React from 'react';

import ErrorPanel from '@/components/error-panel/error-panel';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows/use-list-workflows';
import WorkflowsTable from '@/views/shared/workflows-table/workflows-table';

import { type Props } from '../domain-workflows-table/domain-workflows-table.types';
import getNextSortOrder from '../helpers/get-next-sort-order';

import { styled } from './domain-workflows-table.styles';
import getWorkflowsErrorPanelProps from './helpers/get-workflows-error-panel-props';

export default function DomainWorkflowsTable({ domain, cluster }: Props) {
  const [queryParams, setQueryParams] = usePageQueryParams(
    domainPageQueryParamsConfig
  );

  const {
    workflows,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useListWorkflows({
    domain,
    cluster,
    filtersValues: {
      inputType: queryParams.inputType,
      search: queryParams.search,
      status: queryParams.status,
      timeRangeStart: queryParams.timeRangeStart,
      timeRangeEnd: queryParams.timeRangeEnd,
      sortColumn: queryParams.sortColumn,
      sortOrder: queryParams.sortOrder,
      query: queryParams.query,
    },
  });

  if (isLoading) {
    return <SectionLoadingIndicator />;
  }

  if (workflows.length === 0) {
    const errorPanelProps = getWorkflowsErrorPanelProps({
      inputType: queryParams.inputType,
      error,
      areSearchParamsAbsent:
        !queryParams.search &&
        !queryParams.status &&
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
    <WorkflowsTable
      workflows={workflows}
      isLoading={isLoading}
      error={error}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
      sortParams={
        queryParams.inputType === 'search'
          ? {
              onSort: (column: string) =>
                setQueryParams({
                  sortColumn: column,
                  sortOrder: getNextSortOrder({
                    currentColumn: queryParams.sortColumn,
                    nextColumn: column,
                    currentSortOrder: queryParams.sortOrder,
                  }),
                }),
              sortColumn: queryParams.sortColumn,
              sortOrder: queryParams.sortOrder,
            }
          : undefined
      }
    />
  );
}
