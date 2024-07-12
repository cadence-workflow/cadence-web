import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import type { PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';

import type domainsPageQueryParamsConfig from '../config/domains-page-query-params.config';
import { type DomainData } from '../domains-page.types';

export type DomainsPageFilterConfig<
  V extends Partial<PageQueryParamValues<typeof domainsPageQueryParamsConfig>>,
> = PageFilterConfig<typeof domainsPageQueryParamsConfig, V> & {
  filterFunc: (
    d: DomainData,
    queryParams: PageQueryParamValues<typeof domainsPageQueryParamsConfig>
  ) => boolean;
};
