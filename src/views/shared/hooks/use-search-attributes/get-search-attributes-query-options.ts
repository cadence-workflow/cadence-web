import { type UseQueryOptions } from '@tanstack/react-query';
import queryString from 'query-string';

import { type GetSearchAttributesResponse } from '@/route-handlers/get-search-attributes/get-search-attributes.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import { type UseSearchAttributesParams } from './use-search-attributes.types';

export default function getSearchAttributesQueryOptions({
  cluster,
  category = 'all',
}: UseSearchAttributesParams): UseQueryOptions<
  GetSearchAttributesResponse,
  RequestError,
  GetSearchAttributesResponse,
  [string, UseSearchAttributesParams]
> {
  return {
    queryKey: ['searchAttributes', { cluster, category }],
    queryFn: ({ queryKey: [_, params] }) => {
      const url = queryString.stringifyUrl({
        url: `/api/clusters/${params.cluster}/search-attributes`,
        query: {
          category: params.category,
        },
      });
      return request(url).then((res) => res.json());
    },
  };
}
