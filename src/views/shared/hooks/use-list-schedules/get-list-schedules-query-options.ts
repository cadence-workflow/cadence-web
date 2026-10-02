import {
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import queryString from 'query-string';

import { type ListSchedulesResponse } from '@/route-handlers/list-schedules/list-schedules.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import { type UseListSchedulesParams } from './use-list-schedules.types';

export default function getListSchedulesQueryOptions({
  domain,
  cluster,
  pageSize,
}: UseListSchedulesParams): UseInfiniteQueryOptions<
  ListSchedulesResponse,
  RequestError,
  InfiniteData<ListSchedulesResponse>,
  ListSchedulesResponse,
  [string, UseListSchedulesParams],
  string | undefined
> {
  return {
    queryKey: ['listSchedules', { domain, cluster, pageSize }],
    queryFn: ({ pageParam }) =>
      request(
        queryString.stringifyUrl({
          url: `/api/domains/${domain}/${cluster}/schedules`,
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
