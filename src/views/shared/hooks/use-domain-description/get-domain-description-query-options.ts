import { type UseQueryOptions } from '@tanstack/react-query';

import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';
import { type DomainDescription } from '@/views/domain-page/domain-page.types';

import { type UseDomainDescriptionParams } from './use-domain-description.types';

export default function getDomainDescriptionQueryOptions({
  domain,
  cluster,
}: UseDomainDescriptionParams): UseQueryOptions<
  DomainDescription,
  RequestError,
  DomainDescription,
  [string, UseDomainDescriptionParams]
> {
  return {
    queryKey: ['describeDomain', { domain, cluster }],
    queryFn: ({ queryKey: [_, params] }) =>
      request(`/api/domains/${params.domain}/${params.cluster}`).then((res) =>
        res.json()
      ),
  };
}
