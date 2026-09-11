import type { PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';

import type domainsPageQueryParamsConfig from '../config/domains-page-query-params.config';
import { type DomainsPageContextType } from '../domains-page-context-provider/domains-page-context-provider.types';
import { type DomainsPageFilterRule } from '../domains-page-filters/domains-page-filters.types';
import { type DomainData, type FilteredDomains } from '../domains-page.types';

export default function getFilteredDomains({
  domains,
  queryParams,
  pageCtx,
  filtersConfig,
}: {
  domains: Array<DomainData>;
  queryParams: PageQueryParamValues<typeof domainsPageQueryParamsConfig>;
  pageCtx: DomainsPageContextType;
  filtersConfig: ReadonlyArray<DomainsPageFilterRule>;
}): FilteredDomains {
  const filtersDeductedFromTotal = filtersConfig.filter(
    (f) => f.deductFilteredResultFromTotal
  );
  const filtersNotDeductedFromTotal = filtersConfig.filter(
    (f) => !f.deductFilteredResultFromTotal
  );

  const lowerCaseSearch = queryParams.searchText?.toLowerCase();
  const filteredDomains: Array<DomainData> = [];
  let totalCount = 0;

  domains.forEach((d) => {
    const isDeductedFromTotal = filtersDeductedFromTotal.some(
      (f) => !f.filterFunc(d, queryParams, pageCtx)
    );
    if (isDeductedFromTotal) return;

    totalCount += 1;

    const matchesSearch =
      !lowerCaseSearch ||
      d.id.toLowerCase() === lowerCaseSearch ||
      d.name.toLowerCase().includes(lowerCaseSearch);
    const matchesRemainingFilters = filtersNotDeductedFromTotal.every((f) =>
      f.filterFunc(d, queryParams, pageCtx)
    );
    if (matchesSearch && matchesRemainingFilters) filteredDomains.push(d);
  });

  return { filteredDomains, totalCount };
}
