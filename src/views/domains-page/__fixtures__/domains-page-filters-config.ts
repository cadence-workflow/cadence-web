import { type DomainsPageFilterRule } from '../domains-page-filters/domains-page-filters.types';

export const mockDomainsPageFiltersConfig: ReadonlyArray<DomainsPageFilterRule> =
  [
    {
      // narrows only
      filterFunc: (domain, queryParams) =>
        Boolean(
          !queryParams.clusterName ||
            domain.clusters.find(
              (c) => c.clusterName === queryParams.clusterName
            )
        ),
    },
    {
      // deducted from total
      filterFunc: (domain, queryParams) =>
        queryParams.showDeprecated
          ? true
          : domain.status === 'DOMAIN_STATUS_REGISTERED',
      deductFilteredResultFromTotal: true,
    },
  ];
