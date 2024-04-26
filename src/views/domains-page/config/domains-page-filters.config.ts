import { DomainPageFilters } from '../domains-page-filters/domains-page-filters.types';
import DomainsPageFiltersClusterName from '../domains-page-filters-cluster-name/domains-page-filters-cluster-name';

const domainPageFilters = [
  {
    id: 'clusterName',
    filterFunc: (domain, queryParams) =>
      Boolean(
        !queryParams.clusterName ||
          domain.clusters.find((c) => c.clusterName === queryParams.clusterName)
      ),
    renderFilter: DomainsPageFiltersClusterName,
  },
] as const satisfies DomainPageFilters;

export default domainPageFilters;
