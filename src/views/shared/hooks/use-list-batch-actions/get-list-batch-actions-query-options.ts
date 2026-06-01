import {
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import queryString from 'query-string';

import { type ListBatchActionsResponse } from '@/route-handlers/list-batch-actions/list-batch-actions.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import { type UseListBatchActionsParams } from './use-list-batch-actions.types';

export default function getListBatchActionsQueryOptions({
  domain,
  cluster,
  pageSize,
}: UseListBatchActionsParams): UseInfiniteQueryOptions<
  ListBatchActionsResponse,
  RequestError,
  InfiniteData<ListBatchActionsResponse>,
  ListBatchActionsResponse,
  [string, UseListBatchActionsParams],
  string | undefined
> {
  return {
    queryKey: ['listBatchActions', { domain, cluster, pageSize }],
    queryFn: ({ pageParam }) =>
      request(
        queryString.stringifyUrl({
          url: `/api/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/batch-actions`,
          query: {
            pageSize: pageSize.toString(),
            nextPage: pageParam,
          },
        })
      ).then((res) => res.json()),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken || undefined,
  };
}
