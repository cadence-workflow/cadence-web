import { type DomainsPageFilterConfig } from '../domains-page-filters/domains-page-filters.types';
import DomainsPageFiltersClusterName from '../domains-page-filters-cluster-name/domains-page-filters-cluster-name';
import { type DomainsPageFiltersClusterNameValue } from '../domains-page-filters-cluster-name/domains-page-filters-cluster-name.types';

const domainsPageFiltersConfig: [
  DomainsPageFilterConfig<DomainsPageFiltersClusterNameValue>,
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
