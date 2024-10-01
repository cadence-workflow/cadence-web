import {
  type PageQueryParamSetter,
  type PageQueryParamValues,
  type PageQueryParams,
} from '@/hooks/use-page-query-params/use-page-query-params.types';

import { type PageFilterConfig } from '../page-filters.types';

export type Props<P extends PageQueryParams> = {
  pageFiltersConfig: Array<PageFilterConfig<P, any>>;
  resetAllFilters: () => void;
  queryParams: PageQueryParamValues<P>;
  setQueryParams: PageQueryParamSetter<P>;
};
