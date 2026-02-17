import { type UseQueryOptions } from '@tanstack/react-query';

import { type GetTaskListsByDomainResponse } from '@/route-handlers/get-task-lists-by-domain/get-task-lists-by-domain.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import { type UseTaskListsByDomainParams } from './use-task-lists-by-domain.types';

export default function getTaskListsByDomainQueryOptions({
  domain,
  cluster,
}: UseTaskListsByDomainParams): UseQueryOptions<
  GetTaskListsByDomainResponse,
  RequestError,
  GetTaskListsByDomainResponse,
  [string, UseTaskListsByDomainParams]
> {
  return {
    queryKey: ['taskListsByDomain', { domain, cluster }],
    queryFn: ({ queryKey: [_, params] }) => {
      return request(
        `/api/domains/${encodeURIComponent(params.domain)}/${encodeURIComponent(params.cluster)}/task-lists`
      ).then((res) => res.json());
    },
  };
}
