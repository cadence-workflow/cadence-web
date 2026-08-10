'use client';
import { useQuery } from '@tanstack/react-query';

import getDomainDescriptionQueryOptions from './get-domain-description-query-options';
import { type UseDomainDescriptionParams } from './use-domain-description.types';

export default function useDomainDescription(
  params: UseDomainDescriptionParams
) {
  return useQuery(getDomainDescriptionQueryOptions(params));
}
