'use client';
import React from 'react';

import ErrorPanel from '@/components/error-panel/error-panel';
import PanelSection from '@/components/panel-section/panel-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import { toggleSortOrder } from '@/utils/sort-by';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows';
import WorkflowsTable from '@/views/shared/workflows-table/workflows-table';

import DOMAIN_WORKFLOWS_PAGE_SIZE from '../config/domain-workflows-page-size.config';

import { type Props } from './domain-workflows-table.types';
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
    listType: 'default',
    pageSize: DOMAIN_WORKFLOWS_PAGE_SIZE,
    inputType: queryParams.inputType,
    search: queryParams.search,
    statuses: queryParams.statuses,
    timeRangeStart: queryParams.timeRangeStart,
    timeRangeEnd: queryParams.timeRangeEnd,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
    query: queryParams.query,
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
        !queryParams.statuses &&
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
                  sortOrder: toggleSortOrder({
                    currentSortColumn: queryParams.sortColumn,
                    currentSortOrder: queryParams.sortOrder,
                    newSortColumn: column,
                    defaultSortOrder: 'DESC',
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
