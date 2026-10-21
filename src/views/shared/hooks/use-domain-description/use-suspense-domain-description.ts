import { useSuspenseQuery } from '@tanstack/react-query';

import getDomainDescriptionQueryOptions from './get-domain-description-query-options';
import { type UseDomainDescriptionParams } from './use-domain-description.types';

export default function useSuspenseDomainDescription(
  params: UseDomainDescriptionParams
) {
  return useSuspenseQuery(getDomainDescriptionQueryOptions(params));
}
