import type { PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';

import domainsPageFiltersConfig from '../config/domains-page-filters.config';
import type domainsPageQueryParamsConfig from '../config/domains-page-query-params.config';
import { type DomainsPageContextType } from '../domains-page-context-provider/domains-page-context-provider.types';
import { type DomainData, type FilteredDomains } from '../domains-page.types';

const scopeFilters = domainsPageFiltersConfig.filter(
  (f) => f.appliesToTotalCount
);
const narrowingFilters = domainsPageFiltersConfig.filter(
  (f) => !f.appliesToTotalCount
);

export default function getFilteredDomains({
  domains,
  queryParams,
  pageCtx,
}: {
  domains: Array<DomainData>;
  queryParams: PageQueryParamValues<typeof domainsPageQueryParamsConfig>;
  pageCtx: DomainsPageContextType;
}): FilteredDomains {
  const lowerCaseSearch = queryParams.searchText?.toLowerCase();
  const filteredDomains: Array<DomainData> = [];
  let totalCount = 0;

  domains.forEach((d) => {
    if (!scopeFilters.every((f) => f.filterFunc(d, queryParams, pageCtx))) {
      return;
    }

    totalCount += 1;

    const matchesSearch =
      !lowerCaseSearch ||
      d.id.toLowerCase() === lowerCaseSearch ||
      d.name.toLowerCase().includes(lowerCaseSearch);

    if (
      matchesSearch &&
      narrowingFilters.every((f) => f.filterFunc(d, queryParams, pageCtx))
    ) {
      filteredDomains.push(d);
    }
  });

  return { filteredDomains, totalCount };
}
