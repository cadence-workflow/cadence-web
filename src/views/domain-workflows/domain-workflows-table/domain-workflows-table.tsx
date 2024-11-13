'use client';
import React, { useMemo } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import queryString from 'query-string';

import ErrorPanel from '@/components/error-panel/error-panel';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import Table from '@/components/table/table';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import {
  type ListWorkflowsResponse,
  type ListWorkflowsRequestQueryParams,
} from '@/route-handlers/list-workflows/list-workflows.types';
import request from '@/utils/request';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';

import domainWorkflowsTableConfig from '../config/domain-workflows-table.config';
import DomainWorkflowsTableEndMessage from '../domain-workflows-table-end-message/domain-workflows-table-end-message';
import getNextSortOrder from '../helpers/get-next-sort-order';

import { PAGE_SIZE } from './domain-workflows-table.constants';
import { styled } from './domain-workflows-table.styles';
import { type Props } from './domain-workflows-table.types';
import getWorkflowsErrorPanelProps from './helpers/get-workflows-error-panel-props';

export default function DomainWorkflowsTable(props: Props) {
  const [queryParams, setQueryParams] = usePageQueryParams(
    domainPageQueryParamsConfig
  );

  const requestQueryParams: ListWorkflowsRequestQueryParams = {
    pageSize: PAGE_SIZE.toString(),
    search: queryParams.search,
    status: queryParams.status,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
    timeRangeStart: queryParams.timeRangeStart?.toISOString(),
    timeRangeEnd: queryParams.timeRangeEnd?.toISOString(),
  };

  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<ListWorkflowsResponse>({
    queryKey: ['listWorkflows', { ...props, ...requestQueryParams }],
    queryFn: async ({ pageParam }) =>
      request(
        queryString.stringifyUrl({
          url: `/api/domains/${props.domain}/${props.cluster}/workflows`,
          query: {
            ...requestQueryParams,
            nextPage: pageParam as string,
          },
        })
      ).then((res) => res.json()),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextPage) return undefined;
      return lastPage.nextPage;
    },
  });

  const workflows = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.workflows ?? []);
  }, [data]);

  if (isLoading) {
    return <SectionLoadingIndicator />;
  }

  if (workflows.length === 0) {
    const errorPanelProps = getWorkflowsErrorPanelProps({
      error,
      areSearchParamsAbsent:
        !queryParams.search &&
        !queryParams.status &&
        !queryParams.timeRangeStart &&
        !queryParams.timeRangeEnd,
    });

    if (errorPanelProps) {
      return <ErrorPanel {...errorPanelProps} reset={refetch} />;
    }
  }

  return (
    <styled.TableContainer>
      <Table
        data={workflows}
        columns={domainWorkflowsTableConfig}
        shouldShowResults={!isLoading && workflows.length > 0}
        onSort={(column) => {
          setQueryParams({
            sortColumn: column,
            sortOrder: getNextSortOrder({
              currentColumn: queryParams.sortColumn,
              nextColumn: column,
              currentSortOrder: queryParams.sortOrder,
            }),
          });
        }}
        sortColumn={queryParams.sortColumn}
        sortOrder={queryParams.sortOrder}
        endMessage={
          <DomainWorkflowsTableEndMessage
            hasWorkflows={workflows.length > 0}
            error={error}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        }
      />
    </styled.TableContainer>
  );
}
