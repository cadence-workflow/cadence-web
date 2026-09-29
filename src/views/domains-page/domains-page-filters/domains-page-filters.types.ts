import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import type {
  PageQueryParams,
  PageQueryParamValues,
} from '@/hooks/use-page-query-params/use-page-query-params.types';

import { type DomainsPageContextType } from '../domains-page-context-provider/domains-page-context-provider.types';
import { type DomainData } from '../domains-page.types';

export type DomainsPageFilterFunc<Q extends PageQueryParams> = (
  d: DomainData,
  queryParams: PageQueryParamValues<Q>,
  pageCtx: DomainsPageContextType
) => boolean;

export type DomainsPageFilterRule<Q extends PageQueryParams> = {
  filterFunc: DomainsPageFilterFunc<Q>;
  /**
   * When true, a domain that this filter removes is also deducted from the total
   * count shown in the page title badge. When unset, the filter only narrows the
   * visible list (like the search text) and the domain still counts toward the
   * total, producing the "X of Y" count.
   */
  deductFilteredResultFromTotal?: boolean;
};

export type DomainsPageFilterConfig<
  Q extends PageQueryParams,
  V extends Partial<PageQueryParamValues<Q>>,
> = PageFilterConfig<Q, V> & DomainsPageFilterRule<Q>;
