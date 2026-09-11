'use client';
import { useContext, useMemo } from 'react';

import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';

import domainsPageFiltersConfig from '../config/domains-page-filters.config';
import domainsPageQueryParamsConfig from '../config/domains-page-query-params.config';
import { DomainsPageContext } from '../domains-page-context-provider/domains-page-context-provider';
import { type DomainData, type FilteredDomains } from '../domains-page.types';
import getFilteredDomains from '../helpers/get-filtered-domains';

export default function useFilteredDomains(
  domains: Array<DomainData>
): FilteredDomains {
  const [queryParams] = usePageQueryParams(domainsPageQueryParamsConfig);
  const pageCtx = useContext(DomainsPageContext);

  return useMemo(
    () =>
      getFilteredDomains({
        domains,
        queryParams,
        pageCtx,
        filtersConfig: domainsPageFiltersConfig,
      }),
    [domains, queryParams, pageCtx]
  );
}
