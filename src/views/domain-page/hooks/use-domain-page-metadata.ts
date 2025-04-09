import useSuspenseDomainDescription from '@/views/shared/hooks/use-suspense-domain-description';

import { type UseDomainPageMetadataParams } from './use-domain-page-metadata.types';

export default function useSuspenseDomainPageMetadata(
  params: UseDomainPageMetadataParams
) {
  const { data: domainDescription } = useSuspenseDomainDescription(params);

  return {
    domainDescription,
  };
}
