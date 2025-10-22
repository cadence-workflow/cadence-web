import { useQuery } from '@tanstack/react-query';

import getSearchAttributesQueryOptions from './get-search-attributes-query-options';
import { type UseSearchAttributesParams } from './use-search-attributes.types';

export default function useSearchAttributes(params: UseSearchAttributesParams) {
  return useQuery(getSearchAttributesQueryOptions(params));
}
