import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import type { PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';

import type domainsPageQueryParamsConfig from '../config/domains-page-query-params.config';
import { type DomainsPageContextType } from '../domains-page-context-provider/domains-page-context-provider.types';
import { type DomainData } from '../domains-page.types';

export type DomainsPageFilterFunc = (
  d: DomainData,
  queryParams: PageQueryParamValues<typeof domainsPageQueryParamsConfig>,
  pageCtx: DomainsPageContextType
) => boolean;

export type DomainsPageFilterRule = {
  filterFunc: DomainsPageFilterFunc;
  /**
   * When true, a domain that this filter removes is also deducted from the total
   * count shown in the page title badge. When unset, the filter only narrows the
   * visible list (like the search text) and the domain still counts toward the
   * total, producing the "X of Y" count.
   */
  deductFilteredResultFromTotal?: boolean;
};

export type DomainsPageFilterConfig<
  V extends Partial<PageQueryParamValues<typeof domainsPageQueryParamsConfig>>,
> = PageFilterConfig<typeof domainsPageQueryParamsConfig, V> &
  DomainsPageFilterRule;
