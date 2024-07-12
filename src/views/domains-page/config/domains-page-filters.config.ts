import { type DomainsPageFilterConfig } from '../domains-page-filters/domains-page-filters.types';
import { type DomainPageFiltersClusterNameValue } from '../domains-page-filters-cluster-name/domain-page-filters-cluster-name.types';
import DomainsPageFiltersClusterName from '../domains-page-filters-cluster-name/domains-page-filters-cluster-name';

const domainsPageFiltersConfig: [
  DomainsPageFilterConfig<DomainPageFiltersClusterNameValue>,
] = [
  {
    id: 'clusterName',
    filterFunc: (domain, queryParams) =>
      Boolean(
        !queryParams.clusterName ||
          domain.clusters.find((c) => c.clusterName === queryParams.clusterName)
      ),
    getValue: (v) => ({ clusterName: v.clusterName }),
    formatValue: (v) => v,
    component: DomainsPageFiltersClusterName,
  },
] as const;

export default domainsPageFiltersConfig;
