import { type DomainsPageFilterConfig } from '../domains-page-filters/domains-page-filters.types';
import DomainsPageFiltersClusterName from '../domains-page-filters-cluster-name/domains-page-filters-cluster-name';
import { type DomainsPageFiltersClusterNameValue } from '../domains-page-filters-cluster-name/domains-page-filters-cluster-name.types';
import DomainsPageFilterDeprecated from '../domains-page-filters-deprecated/domains-page-filters-deprecated';
import { type DomainsPageFiltersDeprecatedValue } from '../domains-page-filters-deprecated/domains-page-filters-deprecated.types';

const domainsPageFiltersConfig: [
  DomainsPageFilterConfig<DomainsPageFiltersClusterNameValue>,
  DomainsPageFilterConfig<DomainsPageFiltersDeprecatedValue>,
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
  {
    id: 'showDeprecated',
    filterFunc: (domain, queryParams) =>
      queryParams.showDeprecated
        ? true
        : domain.status === 'DOMAIN_STATUS_REGISTERED',
    getValue: (v) => ({ showDeprecated: v.showDeprecated }),
    formatValue: (v) => ({
      showDeprecated: v.showDeprecated
        ? v.showDeprecated.toString()
        : undefined,
    }),
    component: DomainsPageFilterDeprecated,
    mini: true,
  },
] as const;

export default domainsPageFiltersConfig;
