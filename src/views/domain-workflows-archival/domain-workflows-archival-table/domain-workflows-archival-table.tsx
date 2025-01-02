'use client';
import React from 'react';

import ErrorPanel from '@/components/error-panel/error-panel';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import { toggleSortOrder } from '@/utils/sort-by';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows';
import WorkflowsTable from '@/views/shared/workflows-table/workflows-table';

import DOMAIN_WORKFLOWS_ARCHIVAL_PAGE_SIZE from '../config/domain-workflows-archival-page-size.config';

import { styled } from './domain-workflows-archival-table.styles';
import { type Props } from './domain-workflows-archival-table.types';
import getArchivalErrorPanelProps from './helpers/get-archival-error-panel-props';

export default function DomainWorkflowsArchivalTable({
  domain,
  cluster,
}: Props) {
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
    listType: 'archived',
    pageSize: DOMAIN_WORKFLOWS_ARCHIVAL_PAGE_SIZE,
    inputType: queryParams.inputTypeArchival,
    search: queryParams.searchArchival,
    status: queryParams.statusArchival,
    timeRangeStart: queryParams.timeRangeStartArchival,
    timeRangeEnd: queryParams.timeRangeEndArchival,
    sortColumn: queryParams.sortColumnArchival,
    sortOrder: queryParams.sortOrderArchival,
    query: queryParams.queryArchival,
  });

  if (isLoading) {
    return <SectionLoadingIndicator />;
  }

  if (workflows.length === 0 && error) {
    return (
      <styled.ErrorPanelContainer>
        <ErrorPanel
          {...getArchivalErrorPanelProps({
            inputType: queryParams.inputTypeArchival,
            error,
            queryString: queryParams.queryArchival,
          })}
          reset={refetch}
        />
      </styled.ErrorPanelContainer>
    );
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
        queryParams.inputTypeArchival === 'search'
          ? {
              onSort: (column: string) =>
                setQueryParams({
                  sortColumn: column,
                  sortOrder: toggleSortOrder({
                    currentSortColumn: queryParams.sortColumnArchival,
                    currentSortOrder: queryParams.sortOrderArchival,
                    newSortColumn: column,
                    defaultSortOrder: 'DESC',
                  }),
                }),
              sortColumn: queryParams.sortColumnArchival,
              sortOrder: queryParams.sortOrderArchival,
            }
          : undefined
      }
    />
  );
}
