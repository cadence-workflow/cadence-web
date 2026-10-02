import type {
  PageQueryParams,
  PageQueryParamValues,
} from '@/hooks/use-page-query-params/use-page-query-params.types';

import { type DomainsPageContextType } from '../domains-page-context-provider/domains-page-context-provider.types';
import { type DomainsPageFilterRule } from '../domains-page-filters/domains-page-filters.types';
import { type DomainData, type FilteredDomains } from '../domains-page.types';

export default function getFilteredDomains<Q extends PageQueryParams>({
  domains,
  queryParams,
  pageCtx,
  filterRules,
}: {
  domains: Array<DomainData>;
  queryParams: PageQueryParamValues<Q>;
  pageCtx: DomainsPageContextType;
  filterRules: ReadonlyArray<DomainsPageFilterRule<Q>>;
}): FilteredDomains {
  const rulesDeductedFromTotal = filterRules.filter(
    (r) => r.deductFilteredResultFromTotal
  );
  const rulesNotDeductedFromTotal = filterRules.filter(
    (r) => !r.deductFilteredResultFromTotal
  );

  const filteredDomains: Array<DomainData> = [];
  let totalCount = 0;

  domains.forEach((d) => {
    const isDeductedFromTotal = rulesDeductedFromTotal.some(
      (r) => !r.filterFunc(d, queryParams, pageCtx)
    );
    if (isDeductedFromTotal) return;

    totalCount += 1;

    const matchesRemainingRules = rulesNotDeductedFromTotal.every((r) =>
      r.filterFunc(d, queryParams, pageCtx)
    );
    if (matchesRemainingRules) filteredDomains.push(d);
  });

  return { filteredDomains, totalCount };
}
