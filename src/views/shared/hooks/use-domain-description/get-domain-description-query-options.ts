import {
  type UseQueryOptions,
  type UseSuspenseQueryOptions,
} from '@tanstack/react-query';

import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';
import { type DomainDescription } from '@/views/domain-page/domain-page.types';

import { type UseDomainDescriptionParams } from './use-domain-description.types';

function buildDomainDescriptionQueryOptions({
  domain,
  cluster,
}: UseDomainDescriptionParams) {
  return {
    queryKey: ['describeDomain', { domain, cluster }] as [
      string,
      UseDomainDescriptionParams,
    ],
    queryFn: ({
      queryKey: [_, params],
    }: {
      queryKey: [string, UseDomainDescriptionParams];
    }) =>
      request(`/api/domains/${params.domain}/${params.cluster}`).then((res) =>
        res.json()
      ),
  };
}

export default function getDomainDescriptionQueryOptions(
  params: UseDomainDescriptionParams
): UseQueryOptions<
  DomainDescription,
  RequestError,
  DomainDescription,
  [string, UseDomainDescriptionParams]
> {
  return buildDomainDescriptionQueryOptions(params);
}

export function getDomainDescriptionSuspenseQueryOptions(
  params: UseDomainDescriptionParams
): UseSuspenseQueryOptions<
  DomainDescription,
  RequestError,
  DomainDescription,
  [string, UseDomainDescriptionParams]
> {
  return buildDomainDescriptionQueryOptions(params);
}
