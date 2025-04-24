import { useSuspenseQuery } from '@tanstack/react-query';

import { type RequestError } from '@/utils/request/request-error';
import { type DomainDescription } from '@/views/domain-page/domain-page.types';

import getDomainDescriptionQueryOptions from './get-domain-description-query-options';
import { type UseDomainDescriptionParams } from './use-domain-description.types';

export default function useSuspenseDomainDescription(
  params: UseDomainDescriptionParams
) {
  return useSuspenseQuery<
    DomainDescription,
    RequestError,
    DomainDescription,
    [string, { domain: string; cluster: string }]
  >(getDomainDescriptionQueryOptions(params));
}
