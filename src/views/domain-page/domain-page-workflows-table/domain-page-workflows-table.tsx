'use client';
import React, { useMemo } from 'react';

import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import queryString from 'query-string';

import PageSection from '@/components/page-section/page-section';
import Table from '@/components/table/table';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import {
  type ListWorkflowsResponse,
  type ListWorkflowsRequestQueryParams,
} from '@/route-handlers/list-workflows/list-workflows.types';
import request from '@/utils/request';

import domainPageQueryParamsConfig from '../config/domain-page-query-params.config';
import domainPageWorkflowsTableConfig from '../config/domain-page-workflows-table.config';
import DomainPageWorkflowsTableEndMessage from '../domain-page-workflows-table-end-message/domain-page-workflows-table-end-message';
import getNextSortOrder from '../helpers/get-next-sort-order';

import { PAGE_SIZE } from './domain-page-workflows-table.constants';
import { type Props } from './domain-page-workflows-table.types';

export default function DomainPageWorkflowsTable(props: Props) {
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
  } = useSuspenseInfiniteQuery<ListWorkflowsResponse>({
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
      ).then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch workflows');
        }
        return res.json();
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextPage) return undefined;
      return lastPage.nextPage;
    },
  });

  const workflows = useMemo(
    () => data.pages.flatMap((page) => page.workflows ?? []),
    [data]
  );

  return (
    <PageSection>
      <Table
        data={workflows}
        columns={domainPageWorkflowsTableConfig}
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
          <DomainPageWorkflowsTableEndMessage
            hasWorkflows={workflows.length > 0}
            error={error}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        }
      />
    </PageSection>
  );
}
