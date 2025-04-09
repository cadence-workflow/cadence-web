import useSuspenseDomainDescription from '@/views/shared/hooks/use-suspense-domain-description';

import { type UseSuspenseDomainPageMetadataParams } from './use-suspense-domain-page-metadata.types';

export default function useSuspenseDomainPageMetadata(
  params: UseSuspenseDomainPageMetadataParams
) {
  const { data: domainDescription } = useSuspenseDomainDescription(params);

  return {
    domainDescription,
  };
}
