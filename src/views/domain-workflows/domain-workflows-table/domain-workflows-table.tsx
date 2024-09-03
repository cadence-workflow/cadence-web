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

import domainWorkflowsQueryParamsConfig from '../config/domain-workflows-query-params.config';
import domainWorkflowsTableConfig from '../config/domain-workflows-table.config';
import DomainWorkflowsTableEndMessage from '../domain-workflows-table-end-message/domain-workflows-table-end-message';
import getNextSortOrder from '../helpers/get-next-sort-order';

import {
  NO_WORKFLOWS_ERROR_MESSAGE,
  PAGE_SIZE,
} from './domain-workflows-table.constants';
import { type Props } from './domain-workflows-table.types';

export default function DomainWorkflowsTable(props: Props) {
  const [queryParams, setQueryParams] = usePageQueryParams(
    domainWorkflowsQueryParamsConfig
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
      ).then((res) => res.json()),
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

  if (
    !queryParams.search &&
    !queryParams.status &&
    !queryParams.timeRangeStart &&
    !queryParams.timeRangeEnd &&
    workflows.length === 0
  ) {
    throw new Error(NO_WORKFLOWS_ERROR_MESSAGE);
  }

  return (
    <PageSection>
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
    </PageSection>
  );
}
