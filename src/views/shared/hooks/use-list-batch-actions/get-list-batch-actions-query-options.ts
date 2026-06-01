import queryString from 'query-string';

import request from '@/utils/request';

import {
  type UseListBatchActionsParams,
  type UseListBatchActionsQueryOptions,
} from './use-list-batch-actions.types';

export default function getListBatchActionsQueryOptions({
  domain,
  cluster,
  pageSize,
  ...queryOptions
}: UseListBatchActionsParams): UseListBatchActionsQueryOptions {
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
    ...queryOptions,
  };
}
