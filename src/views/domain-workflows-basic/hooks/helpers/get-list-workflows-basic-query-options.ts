import queryString from 'query-string';

import { type SingleInfiniteQueryOptions } from '@/hooks/use-merged-infinite-queries/use-merged-infinite-queries.types';
import {
  type ListWorkflowsBasicResponse,
  type ListWorkflowsBasicRequestQueryParams,
} from '@/route-handlers/list-workflows-basic/list-workflows-basic.types';
import request from '@/utils/request';

export default function getListWorkflowsBasicQueryOptions({
  domain,
  cluster,
  requestQueryParams,
}: {
  domain: string;
  cluster: string;
  requestQueryParams: ListWorkflowsBasicRequestQueryParams;
}): SingleInfiniteQueryOptions<ListWorkflowsBasicResponse, string | undefined> {
  return {
    queryKey: [
      'listWorkflowsBasic',
      { domain, cluster, ...requestQueryParams },
    ],
    queryFn: async ({ pageParam }) =>
      request(
        queryString.stringifyUrl({
          url: `/api/domains/${domain}/${cluster}/workflows-basic`,
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
    retry: false,
    refetchOnWindowFocus: (query) => query.state.status !== 'error',
    gcTime: 0,
  };
}
