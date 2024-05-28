import type { PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';
import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';

import domainsPageQueryParamsConfig from '../config/domains-page-query-params.config';
import { type DomainData } from '../domains-page.types';

export type DomainsPageFilterConfig = PageFilterConfig<
  typeof domainsPageQueryParamsConfig
> & {
  filterFunc: (
    d: DomainData,
    queryParams: PageQueryParamValues<typeof domainsPageQueryParamsConfig>
  ) => boolean;
};

export type DomainsPageFiltersConfig = Array<DomainsPageFilterConfig>;
