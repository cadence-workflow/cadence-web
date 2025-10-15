import { type SearchAttributesCategory } from '@/route-handlers/get-search-attributes/get-search-attributes.types';

export type UseSearchAttributesParams = {
  cluster: string;
  category?: SearchAttributesCategory;
};
