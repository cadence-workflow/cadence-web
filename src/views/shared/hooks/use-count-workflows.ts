'use client';

import { useQuery } from '@tanstack/react-query';
import queryString from 'query-string';

import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import {
  type CountWorkflowsResponse,
  type UseCountWorkflowsParams,
} from './use-count-workflows.types';

export default function useCountWorkflows({
  domain,
  cluster,
  query,
}: UseCountWorkflowsParams) {
  const queryResult = useQuery<CountWorkflowsResponse, RequestError>({
    queryKey: ['countWorkflows', { domain, cluster, query }],
    queryFn: async () =>
      request(
        queryString.stringifyUrl({
          url: `/api/domains/${domain}/${cluster}/workflows/count`,
          query: {
            inputType: 'query',
            listType: 'default',
            query,
          },
        })
      ).then((res) => res.json()),
  });

  return {
    count: queryResult.data?.count,
    ...queryResult,
  };
}
