import { useSuspenseQuery } from '@tanstack/react-query';

import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';
import { type DomainDescription } from '@/views/domain-page/domain-page.types';

import { type UseSuspenseDomainDescriptionProps } from './use-suspense-domain-description.types';

export default function useSuspenseDomainDescription({
  domain,
  cluster,
}: UseSuspenseDomainDescriptionProps) {
  return useSuspenseQuery<
    DomainDescription,
    RequestError,
    DomainDescription,
    [string, { domain: string; cluster: string }]
  >({
    queryKey: ['describeDomain', { domain, cluster }],
    queryFn: ({ queryKey: [_, params] }) =>
      request(`/api/domains/${params.domain}/${params.cluster}`).then((res) =>
        res.json()
      ),
  });
}
