import { useSuspenseQuery } from '@tanstack/react-query';

import getIsExtendedMetadataEnabledQueryOptions from './get-is-extended-metadata-enabled-query-options';

export default function useSuspenseIsExtendedMetadataEnabled() {
  return useSuspenseQuery(getIsExtendedMetadataEnabledQueryOptions());
}
