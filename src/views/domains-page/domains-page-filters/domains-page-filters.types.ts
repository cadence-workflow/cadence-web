import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import type { PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';

import type domainsPageQueryParamsConfig from '../config/domains-page-query-params.config';
import { type DomainsPageContextType } from '../domains-page-context-provider/domains-page-context-provider.types';
import { type DomainData } from '../domains-page.types';

export type DomainsPageFilterConfig<
  V extends Partial<PageQueryParamValues<typeof domainsPageQueryParamsConfig>>,
> = PageFilterConfig<typeof domainsPageQueryParamsConfig, V> & {
  filterFunc: (
    d: DomainData,
    queryParams: PageQueryParamValues<typeof domainsPageQueryParamsConfig>,
    pageCtx: DomainsPageContextType
  ) => boolean;
  /**
   * Filters with this flag define the scope of the listed domains rather than
   * narrowing within it. They are applied before computing the total count in
   * the page title badge; filters without it (and the search text) only narrow
   * the visible list and produce the "X of Y" count.
   */
  appliesToTotalCount?: boolean;
};
