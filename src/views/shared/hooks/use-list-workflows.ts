'use client';
import { useMemo } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import queryString from 'query-string';

import {
  type RouteParams as ListWorkflowsRouteParams,
  type ListWorkflowsResponse,
  type ListWorkflowsRequestQueryParams,
} from '@/route-handlers/list-workflows/list-workflows.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import DOMAIN_WORKFLOWS_PAGE_SIZE from '../../domain-workflows/config/domain-workflows-page-size.config';
import { type WorkflowsFiltersValues } from '../workflows-header/workflows-header.types';

export default function useListWorkflows({
  domain,
  cluster,
  filtersValues,
  pageSize = DOMAIN_WORKFLOWS_PAGE_SIZE,
}: ListWorkflowsRouteParams & {
  filtersValues: WorkflowsFiltersValues;
  pageSize?: number;
}) {
  const {
    inputType,
    search,
    status,
    timeRangeStart,
    timeRangeEnd,
    sortColumn,
    sortOrder,
    query,
  } = filtersValues;

  const requestQueryParams = {
    inputType,
    ...(inputType === 'query'
      ? {
          query,
        }
      : {
          search,
          status,
          sortColumn,
          sortOrder,
          timeRangeStart: timeRangeStart?.toISOString(),
          timeRangeEnd: timeRangeEnd?.toISOString(),
        }),
  };

  const queryResult = useInfiniteQuery<ListWorkflowsResponse, RequestError>({
    queryKey: [
      'listWorkflows',
      { domain, cluster, ...requestQueryParams, pageSize },
    ],
    queryFn: async ({ pageParam }) =>
      request(
        queryString.stringifyUrl({
          url: `/api/domains/${domain}/${cluster}/workflows`,
          query: {
            ...requestQueryParams,
            listType: 'default',
            pageSize: pageSize.toString(),
            nextPage: pageParam as string,
          } as const satisfies ListWorkflowsRequestQueryParams,
        })
      ).then((res) => res.json()),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextPage) return undefined;
      return lastPage.nextPage;
    },
    retry: false,
    refetchOnWindowFocus: (query) => query.state.status !== 'error',
    gcTime: 0,
  });

  const workflows = useMemo(() => {
    if (!queryResult.data) return [];
    return queryResult.data.pages.flatMap((page) => page.workflows ?? []);
  }, [queryResult.data]);

  return {
    workflows,
    ...queryResult,
  };
}
